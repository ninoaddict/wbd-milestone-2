import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil, MapPin, Plus } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Profile } from "@/domain/interfaces/user.interface";

export default function SelfProfilePage(profile: Profile) {
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

              {/* Edit Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 sm:right-4 sm:top-4"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <div className="p-4 sm:p-6 mt-4">
                <div className="mb-4 flex flex-col sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h1 className="text-2xl font-semibold">{profile.name}</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      {profile.username}
                    </p>
                    <div className="mt-2">
                      <Link
                        href="#"
                        className="text-xs sm:text-sm text-primary hover:underline"
                      >
                        {profile.connection_count} connections
                      </Link>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="mt-2 sm:mt-0">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button className="bg-[#0a66c2] text-xs sm:text-sm hover:bg-[#0a66c2b6]">
                    Update profile
                  </Button>
                </div>
              </div>
            </Card>

            {/* Work Experience */}
            <Card className="p-4 sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-semibold">Experience</h2>
                <Button variant="ghost" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((job) => (
                  <div key={job} className="flex gap-4">
                    <div>
                      <h3 className="text-sm sm:text-base font-semibold">
                        Senior Software Engineer
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Tech Company
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Jan 2020 - Present · 4 yrs
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        San Francisco Bay Area
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
                <Button variant="ghost" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-4">
                {["React", "TypeScript", "Node.js", "Express.js"].map(
                  (skill) => (
                    <div
                      key={skill}
                      className="flex items-center justify-between"
                    >
                      <Badge className="text-sm font-semibold">{skill}</Badge>
                    </div>
                  )
                )}
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
                {[1, 2, 3, 4, 5].map((post) => (
                  <Card key={post} className="p-3 sm:p-4">
                    <h3 className="text-sm sm:text-base font-semibold">
                      Exciting new developments in React 19
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Shared by John Developer · 2d ago
                    </p>
                    <p className="mt-2 text-xs sm:text-sm">
                      Check out these amazing new features coming to React...
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
