import { useQuery } from "@tanstack/react-query"
import { getAPI } from "@/api/api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const Attendee = ({ attendee }) => {
  const { data: currentUser, isFetched } = useQuery({
    queryKey: ["user", attendee.userId],
    queryFn: async () => {
      const res = await getAPI(`user/${attendee.userId}`)
      return res.data
    },
    enabled: !!attendee.userId,
  })

  return (
    <>
      {isFetched && (
        <Avatar>
          <AvatarImage
            src={isFetched && currentUser.image_url}
            alt={isFetched && currentUser.first_name}
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      )}
    </>
  )
}

export default Attendee
