import DataTable from "./data-table"
import { columns } from "./column"
// import { useQueryCache } from "@/hooks/useQueryCache";
import { getAPI } from "@/api/api"
import useToken from "@/hooks/useToken"
import { useQuery } from "@tanstack/react-query"

// const Page = () => {
//   const { userId } = useToken();

//   const { data, isFetched } = useQueryCache(`event/${userId}`, "/user", { id: userId }, !!userId);

//   const { userId } = useToken()
//   const {
//     data: user,
//     isLoading,
//     isFetched: userFetched,
//   } = useQuery()

//   return <div className="container mx-auto py-10">{isFetched && <DataTable columns={columns} data={data} />}</div>;
// };

const Page = () => {
  const { userId } = useToken()

  const { data, isFetched: userFetched } = useQuery(
    ["event-user"],
    async () => {
      try {
        const res = await getAPI(`events/${userId}`)
        return res.data
      } catch (error) {
        throw new Error(error.response.data.message)
      }
    }
  )
  return (
    <div className="container mx-auto py-10">
      {userFetched && <DataTable columns={columns} data={data} />}
    </div>
  )
}

export default Page
