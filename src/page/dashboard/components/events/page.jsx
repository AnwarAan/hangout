import DataTable from "./data-table";
import { columns } from "./column";
import { useQueryCache } from "@/hooks/useQueryCache";
import useToken from "@/hooks/useToken";

const Page = () => {
  const { userId } = useToken();

  const { data, isFetched } = useQueryCache(`event/${userId}`, "/user", { id: userId }, !!userId);

  return <div className="container mx-auto py-10">{isFetched && <DataTable columns={columns} data={data} />}</div>;
};

export default Page;
