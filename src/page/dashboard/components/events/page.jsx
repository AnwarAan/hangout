import DataTable from "./data-table"
import { columns } from "./column"

const Page = ({ events }) => {
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={events} />
    </div>
  )
}

export default Page
