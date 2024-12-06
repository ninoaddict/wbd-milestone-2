import { Card } from "@/components/ui/card";
import { Link, useRouter } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Profile } from "@/domain/interfaces/user.interface";
import { EditProfileModal } from "./edit-profile-modal";
import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateProfile, UpdateProfilePayload } from "@/services/profile";
import { useAuth } from "@/context/auth-context";
import { AxiosError } from "axios";
import { AddExperience } from "./add-experience-modal";
import { sortExperiences } from "@/lib/utils";
import { experienceType } from "@/domain/interfaces/profile.interface";
import { EditExperience } from "./edit-experience-modal";
import { EditSkills } from "./edit-skillls-modal";
import EditProfilePicture from "./edit-picture-modal";
import { STORAGE_URL } from "@/lib/const";

export default function SelfProfilePage({ profile }: { profile: Profile }) {
  let initExp: experienceType[] = [];
  let initSkills: string[] = [];

  profile.relevant_post?.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  let newList = profile.relevant_post?.slice(0, 4);
  profile.relevant_post?.slice(0, 4);

  try {
    if (profile && profile.work_history && profile.work_history !== "") {
      const raw = JSON.parse(profile.work_history);

      const unsortedInitExp = raw.map((d: any) => {
        return {
          title: d[0],
          company: d[1],
          startDate: d[2],
          endDate: d[3],
          location: d[4],
        };
      });
      initExp = sortExperiences(unsortedInitExp);
    }

    if (profile && profile.skills && profile.skills !== "") {
      initSkills = JSON.parse(profile.skills);
    }
  } catch (error) {
    // fail to parse
  }

  const router = useRouter();
  const { user, loading, setUser } = useAuth();
  const [name, setName] = useState<string>(profile.name);
  const [username, setUsername] = useState<string>(profile.username);
  const [experience, setExperience] = useState(initExp);
  const [skills, setSkills] = useState(initSkills);
  const [profilePhoto, setProfilePhoto] = useState(
    profile.profile_photo ? `${STORAGE_URL}/${profile.profile_photo}` : ""
  );

  const mutation = useMutation({
    mutationFn: (payload: UpdateProfilePayload) => {
      return updateProfile(payload);
    },
    onSuccess: (data) => {
      setUser(data);
      setName(data.name);
      setUsername(data.username);
      setProfilePhoto(
        data.profile_photo_path
          ? `${STORAGE_URL}/${data.profile_photo_path}`
          : ""
      );
      try {
        if (data.work_history !== "") {
          const rawData = JSON.parse(data.work_history);
          const exps = rawData.map((d: any) => {
            return {
              title: d[0],
              company: d[1],
              startDate: d[2],
              endDate: d[3],
              location: d[4],
            };
          });
          const sortedExps = sortExperiences(exps);
          setExperience(sortedExps);
        }
      } catch (error) {
        // handler error
      }
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        console.log(err.response?.data.message);
      } else {
        console.error("Unexpected error:", err);
      }
    },
  });

  const handleUploadPhoto = useCallback(
    (file: File | null) => {
      mutation.mutate({
        id: user!.id,
        name,
        username,
        skills: JSON.stringify(skills),
        work_history: JSON.stringify(
          experience.map((exp) => [
            exp.title,
            exp.company,
            exp.startDate,
            exp.endDate,
            exp.location,
          ])
        ),
        profile_photo: file,
      });
    },
    [mutation, user, name, username, skills, experience]
  );

  const handleEditSkills = useCallback(
    (newSkills: string[]) => {
      mutation.mutate({
        id: user!.id,
        name,
        username,
        skills: JSON.stringify(newSkills),
        work_history: JSON.stringify(
          experience.map((exp) => [
            exp.title,
            exp.company,
            exp.startDate,
            exp.endDate,
            exp.location,
          ])
        ),
      });
      setSkills(newSkills);
    },
    [mutation, user, name, username, experience]
  );

  const handleAddExperience = useCallback(
    (data: experienceType) => {
      if (
        data.title &&
        data.company &&
        data.endDate &&
        data.startDate &&
        data.location
      ) {
        const newExps = [...experience, data];
        const sortedExps = sortExperiences(newExps);
        mutation.mutate({
          id: user!.id,
          name,
          username,
          skills: JSON.stringify(skills),
          work_history: JSON.stringify(
            sortedExps.map((exp) => [
              exp.title,
              exp.company,
              exp.startDate,
              exp.endDate,
              exp.location,
            ])
          ),
        });
      }
    },
    [mutation, user, name, username, skills, experience]
  );

  const handleEditExperience = useCallback(
    (data: experienceType, id: number) => {
      if (
        data.title &&
        data.company &&
        data.endDate &&
        data.startDate &&
        data.location &&
        id < experience.length &&
        id >= 0
      ) {
        const newExps = experience.map((ex, idx) => (id === idx ? data : ex));
        const sortedExps = sortExperiences(newExps);
        mutation.mutate({
          id: user!.id,
          name,
          username,
          skills: JSON.stringify(skills),
          work_history: JSON.stringify(
            sortedExps.map((exp) => [
              exp.title,
              exp.company,
              exp.startDate,
              exp.endDate,
              exp.location,
            ])
          ),
        });
      }
    },
    [mutation, user, name, username, skills, experience]
  );

  const handleDeleteExperience = useCallback(
    (id: number) => {
      if (id < experience.length && id >= 0) {
        const newExps = experience.filter((_, idx) => idx !== id);
        const sortedExps = sortExperiences(newExps);
        mutation.mutate({
          id: user!.id,
          name,
          username,
          skills: JSON.stringify(skills),
          work_history: JSON.stringify(
            sortedExps.map((exp) => [
              exp.title,
              exp.company,
              exp.startDate,
              exp.endDate,
              exp.location,
            ])
          ),
        });
      }
    },
    [mutation, user, name, username, skills, experience]
  );

  const handleUpdateProfile = useCallback(
    (name: string, username: string) => {
      mutation.mutate({
        id: user!.id,
        name,
        username,
        skills: JSON.stringify(skills),
        work_history: JSON.stringify(
          experience.map((exp) => [
            exp.title,
            exp.company,
            exp.startDate,
            exp.endDate,
            exp.location,
          ])
        ),
      });
    },
    [mutation, user, skills, experience]
  );

  if (loading) {
    return <div></div>;
  }

  const ago: string[] = [];
  if (profile.relevant_post) {
    for (let feed of profile.relevant_post) {
      const millisec = Math.floor(
        Date.now() - new Date(feed.createdAt).getTime()
      );
      if (millisec >= 1000 * 60 && millisec < 1000 * 60 * 60) {
        ago.push(`Created ${Math.floor(millisec / (1000 * 60))} minutes ago`);
      } else if (millisec >= 1000 * 60 * 60 && millisec < 1000 * 60 * 60 * 24) {
        ago.push(
          `Created ${Math.floor(millisec / (1000 * 60 * 60))} hours ago`
        );
      } else if (
        millisec >= 1000 * 60 * 60 * 24 &&
        millisec < 1000 * 60 * 60 * 24 * 7
      ) {
        ago.push(
          `Created ${Math.floor(millisec / (1000 * 60 * 60 * 24))} days ago`
        );
      } else if (
        millisec >= 1000 * 60 * 60 * 24 * 7 &&
        millisec < 1000 * 60 * 60 * 24 * 30
      ) {
        ago.push(
          `Created ${Math.floor(millisec / (1000 * 60 * 60 * 24 * 7))} weeks ago`
        );
      } else if (
        millisec >= 1000 * 60 * 60 * 24 * 30 &&
        millisec < 1000 * 60 * 60 * 24 * 365
      ) {
        ago.push(
          `Created ${Math.floor(millisec / (1000 * 60 * 60 * 24 * 30))} months ago`
        );
      } else if (millisec >= 1000 * 60 * 60 * 24 * 365) {
        ago.push(
          `Created ${Math.floor(millisec / (1000 * 60 * 60 * 24 * 365))} years ago`
        );
      } else {
        ago.push(`Created ${Math.floor(millisec / 1000)} seconds ago`);
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f2ee] pt-[92px] pb-[48px]">
      {/* Profile Header */}

      {/* Main Content */}
      <div className="container mx-auto max-w-[1128px] px-4">
        <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Basic Info */}
            <Card className="relative z-0">
              {/* Cover Photo */}
              <div className="h-32 sm:h-48 bg-gray-300/80 rounded-t-xl">
                <img
                  src="/banner.jpeg"
                  alt="banner"
                  className="object-cover rounded-t-xl w-full h-32 sm:h-48"
                />
              </div>
              {/* Profile Photo */}
              <div className="absolute top-[60px] sm:top-[100px] left-4 sm:left-6">
                <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-white overflow-hidden">
                  <img
                    src={
                      profilePhoto === ""
                        ? "/profile_photo_placeholder.webp"
                        : profilePhoto
                    }
                    alt="Profile photo"
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
                <EditProfilePicture
                  initProfilePicture={profilePhoto}
                  handleUploadPhoto={handleUploadPhoto}
                />
              </div>
              <div className="p-4 sm:p-6 mt-4">
                <div className="mb-4 flex flex-row items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-semibold">{name}</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      {username}
                    </p>
                    <div className="mt-2">
                      <Link
                        href="/"
                        className="text-xs text-[#0a66c2] font-bold sm:text-sm text-primary hover:underline"
                      >
                        {profile.connection_count} connections
                      </Link>
                    </div>
                  </div>
                  <EditProfileModal
                    initName={name}
                    initUserName={username}
                    handleUpdateProfile={handleUpdateProfile}
                  />
                </div>
              </div>
            </Card>

            {/* Work Experience */}
            <Card className="p-4 sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-semibold">
                  Work Experience
                </h2>
                <AddExperience handleAddExperience={handleAddExperience} />
              </div>
              <div className="space-y-4">
                {experience.map((job, id) => (
                  <div key={id} className="flex gap-4 justify-between">
                    <div>
                      <h3 className="text-sm sm:text-base font-semibold">
                        {job.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {job.company}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {job.startDate} - {job.endDate}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {job.location}
                      </p>
                    </div>
                    <EditExperience
                      initExp={job}
                      id={id}
                      handleEditExperience={handleEditExperience}
                      handleDeleteExperience={handleDeleteExperience}
                    />
                  </div>
                ))}
              </div>
            </Card>

            {/* Skills */}
            <Card className="p-4 sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-semibold">Skills</h2>
                <EditSkills
                  initSkills={skills}
                  handleEditSkills={handleEditSkills}
                />
              </div>
              <div className="flex gap-4 flex-wrap">
                {profile.skills !== "" &&
                  skills.map((skill) => (
                    <div
                      key={skill}
                      className="flex items-center justify-between"
                    >
                      <Badge className="text-sm font-semibold">{skill}</Badge>
                    </div>
                  ))}
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Profile Language */}
            <Card className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm sm:text-base font-semibold">
                    Profile language
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    English
                  </p>
                </div>
              </div>
            </Card>

            {/* Recent Posts */}
            <Card className="p-4 sm:p-6">
              <h2 className="mb-4 text-lg sm:text-xl font-semibold">
                Recent Posts
              </h2>
              <div className="space-y-4">
                {newList &&
                  newList.map((post, index) => (
                    <Card key={post.id} className="p-3 sm:p-4">
                      <h3 className="text-sm sm:text-base font-semibold">
                        Post #{ago.length - index}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm">{post.content}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {ago && ago[index]}
                      </p>
                    </Card>
                  ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
