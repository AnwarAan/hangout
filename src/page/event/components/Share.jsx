import { useState } from "react"
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share"
import { EmailIcon, FacebookIcon, TwitterIcon, WhatsappIcon } from "react-share"

const Share = (/*{ tittle, url }*/) => {
  const shareUrl = "https://example.com/event"
  const shareTitle = "Event 1"

  const [copySuccess, setCopySuccess] = useState(false)

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 1500)
    } catch (error) {
      console.error("Failed to copy: ", error)
      setCopySuccess(false)
    }
  }

  return (
    <div className="py-2 overflow-x-hidden">
      <h3 className="text-xl font-semibold">Share Event</h3>
      <span className="flex overflow-x-auto my-4">
        <EmailShareButton url={shareUrl} subject={shareTitle} className="mr-4">
          <EmailIcon iconFillColor="white" round={true} />
        </EmailShareButton>
        <FacebookShareButton
          url={shareUrl}
          quote={shareTitle}
          hashtag="#EventWithHangout"
          className="mr-4"
        >
          <FacebookIcon iconFillColor="white" round={true} />
        </FacebookShareButton>
        <TwitterShareButton
          url={shareUrl}
          title={shareTitle}
          hashtag="#EventWithHangout"
          className="mr-4"
        >
          <TwitterIcon iconFillColor="white" round={true} />
        </TwitterShareButton>
        <WhatsappShareButton url={shareUrl} title={shareTitle} className="mr-4">
          <WhatsappIcon iconFillColor="white" round={true} />
        </WhatsappShareButton>
      </span>
      <span className="flex justify-between items-center p-2 bg-slate-100 rounded-xl">
        <p className="mx-2">{shareUrl}</p>
        <button
          className="bg-blue-300 rounded-3xl py-2 px-4 font-medium"
          onClick={handleCopyClick}
        >
          {copySuccess ? "Copied!" : "Copy"}
        </button>
      </span>
    </div>
  )
}

export default Share
