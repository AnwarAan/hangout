import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, ThumbsDown, ThumbsUp } from "lucide-react";
import CommentSection from "./CommentSection";
import { useState } from "react";

const Comment = ({ comment, event }) => {
  const [isReply, setIsReply] = useState(false);
  // const NestedComment = comment.map((child) => <Comment key={child.id} comment={child} event={event} type="child" />);
  return (
    <>
      {
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-start gap-2">
              <Avatar>
                <AvatarImage src={comment.user.image_url} alt={comment.user.first_name} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span>
                <span className="flex gap-2 items-center">
                  <p className="text-muted-foreground">@{comment.user.first_name}</p>
                  <div className="flex gap-1">
                    {comment.rating &&
                      [...Array(5)].map((star, index) => {
                        const currentRating = index + 1;
                        return (
                          <label key={index}>
                            <input className="hide" type="radio" name="rating" value={currentRating} />
                            <Star
                              fill={currentRating <= comment.rating ? "#2563eb" : "none"}
                              className={`text-primary w-4 h-4`}
                            />
                          </label>
                        );
                      })}
                  </div>
                </span>
                <p>{comment.review}</p>
                <span className="flex gap-2 items-center">
                  <ThumbsUp className="w-4 h-4" />
                  <ThumbsDown className="w-4 h-4" />
                  <p onClick={() => setIsReply(!isReply)} className="text-muted-foreground cursor-pointer">
                    reply
                  </p>
                </span>
              </span>
            </span>
          </div>
          {isReply && (
            <div className="ml-8">
              <CommentSection isChild={true} commentId={comment.id} event={event} />
              {/* {NestedComment} */}
            </div>
          )}
        </div>
      }
    </>
  );
};

export default Comment;
