import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Profile } from "@/domain/interfaces/user.interface";
import { experienceType } from "@/domain/interfaces/profile.interface";

export default function ProfilePage(profile: Profile) {
  let experience: experienceType[] = [];
  let skills: string[] = [];

  profile.relevant_post?.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  let newList = profile.relevant_post?.slice(0,4);
  profile.relevant_post?.slice(0,4);


  try {
    if (profile && profile.work_history && profile.work_history !== "") {
      const raw = JSON.parse(profile.work_history);
      experience = raw.map((d: any) => {
        return {
          title: d[0],
          company: d[1],
          startDate: d[2],
          endDate: d[3],
          location: d[4],
        };
      });
    }

    if (profile && profile.skills && profile.skills !== "") {
      skills = JSON.parse(profile.skills);
    }
  } catch (error) {
    // fail to parse
  }

  const ago: string[] = []
  if (profile.relevant_post) {
    for (let feed of profile.relevant_post) {
      const millisec = Math.floor((Date.now() - new Date(feed.createdAt).getTime()));
      if (millisec >= 1000*60 && millisec < 1000*60*60) {
        ago.push(`Created ${Math.floor(millisec/(1000*60))} minutes ago`);
      } else if (millisec >= 1000*60*60 && millisec < 1000*60*60*24) {
        ago.push(`Created ${Math.floor(millisec/(1000*60*60))} hours ago`);
      } else if (millisec >= 1000*60*60*24 && millisec < 1000*60*60*24*7) {
        ago.push(`Created ${Math.floor(millisec/(1000*60*60*24))} days ago`);
      } else if (millisec >= 1000*60*60*24*7 && millisec < 1000*60*60*24*30) {
        ago.push(`Created ${Math.floor(millisec/(1000*60*60*24*7))} weeks ago`);
      } else if (millisec >= 1000*60*60*24*30 && millisec < 1000*60*60*24*365) {
        ago.push(`Created ${Math.floor(millisec/(1000*60*60*24*30))} months ago`);
      } else if (millisec >= 1000*60*60*24*365) {
        ago.push(`Created ${Math.floor(millisec/(1000*60*60*24*365))} years ago`);
      } else {
        ago.push(`Created ${Math.floor(millisec/(1000))} seconds ago`);
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
                      profile.profile_photo === ""
                        ? "/profile_photo_placeholder.webp"
                        : profile.profile_photo
                    }
                    alt="Profile photo"
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="p-4 sm:p-6 mt-4">
                <div className="mb-4 flex flex-col sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h1 className="text-2xl font-semibold">{profile.name}</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      {profile.username}
                    </p>
                    <div className="mt-2">
                      <Link
                        href="/connections"
                        className="text-xs sm:text-sm text-primary hover:underline"
                      >
                        {profile.connection_count} connections
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.connection_status === "disconnected" && (
                    <Button className="bg-[#0a66c2] text-xs sm:text-sm hover:bg-[#0a66c2b6]">
                      Connect
                    </Button>
                  )}
                  {profile.connection_status === "connected" && (
                    <Button className="bg-[#0a66c2] text-xs sm:text-sm hover:bg-[#0a66c2b6]">
                      Disconnect
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="text-xs sm:text-sm border-[#0a66c2]"
                  >
                    Message
                  </Button>
                </div>
              </div>
            </Card>

            {/* Work Experience */}
            <Card className="p-4 sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-semibold">
                  Work Experience
                </h2>
              </div>
              <div className="space-y-4">
                {experience.map((job, id) => (
                  <div key={id} className="flex gap-4">
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
                  </div>
                ))}
              </div>
            </Card>

            {/* Skills */}
            <Card className="p-4 sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-semibold">Skills</h2>
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
                      <p className="mt-2 text-xs sm:text-sm">
                        {post.content}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {ago && ago[index]}
                      </p>
                    </Card>
                  ))}
                {!profile.relevant_post && <div>This user has no post</div>}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
