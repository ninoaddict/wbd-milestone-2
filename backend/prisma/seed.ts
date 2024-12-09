import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Function to hash passwords
  const hashPassword = async (password: string) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  };

  // Create multiple users with hashed passwords
  const usersData = [
    {
      username: "john_doe",
      email: "john@example.com",
      password: "password",
      full_name: "John Doe",
      work_history: "",
      skills: '["JavaScript", "TypeScript", "Prisma"]',
      profile_photo_path: "",
    },
    {
      username: "jane_smith",
      email: "jane@example.com",
      password: "password",
      full_name: "Jane Smith",
      work_history: "",
      skills: '["Python", "Machine Learning", "Data Analysis"]',
      profile_photo_path: "",
    },
    {
      username: "alice_brown",
      email: "alice@example.com",
      password: "password",
      full_name: "Alice Brown",
      work_history: "",
      skills: '["Figma", "Sketch", "Adobe XD"]',
      profile_photo_path: "",
    },
    {
      username: "bob_johnson",
      email: "bob@example.com",
      password: "password",
      full_name: "Bob Johnson",
      work_history: "",
      skills: '["AWS", "Kubernetes", "Terraform"]',
      profile_photo_path: "",
    },
  ];

  // Hash passwords and prepare user data
  const hashedUsersData = await Promise.all(
    usersData.map(async (user) => ({
      ...user,
      passwordHash: await hashPassword(user.password),
      password: undefined, // Remove the plain text password
    }))
  );

  // Insert users into the database
  const users = await prisma.user.createMany({
    data: hashedUsersData.map(({ password, ...rest }) => rest),
  });

  console.log(`${users.count} users created.`);

  // Retrieve all users for connections and chat rooms
  const allUsers = await prisma.user.findMany();

  // Create connections between all pairs of users
  for (let i = 0; i < allUsers.length; i++) {
    for (let j = i + 1; j < allUsers.length; j++) {
      await prisma.connection.createMany({
        data: [
          { fromId: allUsers[i].id, toId: allUsers[j].id },
          { fromId: allUsers[j].id, toId: allUsers[i].id },
        ],
      });

      // Create a chat room for each pair of connected users
      await prisma.chatRoom.create({
        data: {
          firstUserId: allUsers[i].id,
          secondUserId: allUsers[j].id,
          lastMessage: "Welcome to the chat!",
        },
      });
    }
  }

  // Create sample feeds for each user
  await prisma.feed.createMany({
    data: allUsers.map((user) => ({
      userId: user.id,
      content: `${user.full_name} just joined the platform!`,
    })),
  });

  console.log("Connections, chat rooms, and feeds seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
