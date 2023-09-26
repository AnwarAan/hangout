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

  console.log(userFetched && user);
  const { referrals } = userFetched && user;
  return (
    <>
      <h2 className="font-bold ">My Referals Codes</h2>
      {referrals &&
        referrals.map((referal) => (
          <div
            key={referal.id}
            className="w-full flex justify-between items-start bg-secondary border border-border rounded-md p-2 items-center"
          >
            <span>
              <span className="flex gap-2 items-center">
                <Link to={`/event/${referal.id}`}>
                  <p className="hover:underline cursor-pointer ">{referal.owner}</p>
                </Link>
                {new Date() > new Date(referal.date) && (
                  <Badge className="hover:bg-red-500/50 bg-secondary text-red-500 border border-red-500">Expired</Badge>
                )}
              </span>
              {/* <p className="text-muted-foreground text-xs">{`${format(new Date(referal.date), "PPP")} ${
                referal.time
              }`}</p> */}
            </span>
            <span className="flex items-center gap-4 text-muted-foreground">
              <p className={`${new Date() > new Date(referal.date) && "line-through"} select-none`}>{referal.code}</p>
              <CopyToClipboard referalCode={referal.code} />
            </span>
          </div>
        ))}
    </>
  );
};

export default MyReferals;
