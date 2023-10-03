import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import CopyToClipboard from "./components/CopyToClipboard";
import useToken from "@/hooks/useToken";
import { getAPI } from "@/api/api";

const MyReferals = () => {
  const { userId } = useToken();

  const { data: user, isFetched: userFetched } = useQuery(["user"], async () => {
    const res = await getAPI(`user/${userId}`);
    return res.data;
  });
  const { referrals } = userFetched && user;
  return (
    <>
      <h2 className="font-bold ">My Referals Codes</h2>
      {referrals &&
        referrals.map((referral) => (
          <div
            key={referral.id}
            className="w-full flex justify-between items-start bg-secondary border border-border rounded-md p-2 items-center"
          >
            <span>
              <span className="flex gap-2 items-center">
                <Link to={`/event/${referral.eventId}`}>
                  <p className="hover:underline cursor-pointer ">{referral.event.name}</p>
                </Link>
                {new Date() > new Date(referral.date) && (
                  <Badge className="hover:bg-red-500/50 bg-secondary text-red-500 border border-red-500">Expired</Badge>
                )}
              </span>
              <p className="text-muted-foreground text-xs">{`Expired : ${format(new Date(referral.time), "PPP")} `}</p>
            </span>
            <span className="flex items-center gap-4 text-muted-foreground">
              <p className={`${new Date() > new Date(referral.date) && "line-through"} select-none`}>{referral.code}</p>
              <CopyToClipboard referalCode={referral.code} />
            </span>
          </div>
        ))}
    </>
  );
};

export default MyReferals;
