import { Button } from "@/components/ui/button";
import { UserShortInfo } from "@/domain/interfaces/connection.interface";
import { Link } from "@tanstack/react-router";

interface ConnectionButtonProps {
  info: UserShortInfo;
  onSend: (id: bigint) => void;
  onIgnore: (id: bigint) => void;
  onAccept: (id: bigint) => void;
  onDelete: (id: bigint) => void;
}

export function ConnectionButton({
  info,
  onSend,
  onIgnore,
  onAccept,
  onDelete,
}: ConnectionButtonProps) {
  switch (info.status) {
    case "disconnected":
      return (
        <Button
          size="sm"
          className="bg-white w-full sm:w-auto border border-blue-700 border-solid rounded-2xl text-blue-700 hover:text-white hover:bg-blue-700"
          onClick={() => onSend(info.id)}
        >
          Connect
        </Button>
      );
    case "requesting":
      return <span className="text-sm text-muted-foreground">Pending</span>;
    case "requested":
      return (
        <div className="flex items-center justify-center sm:justify-normal sm:space-x-2 w-full sm:w-auto gap-2 sm:gap-0">
          <Button
            size="sm"
            className="w-full sm:w-auto bg-white border border-red-700 border-solid rounded-2xl text-red-700 hover:text-white hover:bg-red-700"
            onClick={() => onIgnore(info.id)}
          >
            Ignore
          </Button>
          <Button
            size="sm"
            className="w-full sm:w-auto bg-white border border-blue-700 border-solid rounded-2xl text-blue-700 hover:text-white hover:bg-blue-700"
            onClick={() => onAccept(info.id)}
          >
            Accept
          </Button>
        </div>
      );
    case "connected":
      return (
        <div className="flex items-center justify-center sm:justify-normal sm:space-x-2 w-full sm:w-auto gap-2 sm:gap-0">
          <Button
            size="sm"
            className="w-full sm:w-auto border bg-white border-blue-700 border-solid rounded-2xl text-blue-700 hover:text-white hover:bg-blue-700"
            asChild
          >
            <Link to="/chat">Message</Link>
          </Button>
          <Button
            size="sm"
            className="w-full sm:w-auto bg-white border border-red-700 border-solid rounded-2xl text-red-700 hover:text-white hover:bg-red-700"
            onClick={() => onDelete(info.id)}
          >
            Disconnect
          </Button>
        </div>
      );
    case "self":
      return <span className="text-sm text-muted-foreground">You</span>;
    default:
      return null;
  }
}
