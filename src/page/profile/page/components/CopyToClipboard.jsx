import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";

const CopyToClipboard = ({ referalCode }) => {
  const [copy, setCopy] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => {
      setCopy(false);
    }, 1000);

    return () => {
      clearTimeout(id);
    };
  }, [copy]);
  return (
    <span className="p-2 rounded-md border border-border">
      {!copy ? (
        <Copy
          onClick={() => {
            setCopy(true);
            navigator.clipboard.writeText(referalCode);
          }}
          className="w-4 h-4  cursor-pointer"
        />
      ) : (
        <Check className="w-4 h-4 cursor-pointer" />
      )}
    </span>
  );
};

export default CopyToClipboard;
