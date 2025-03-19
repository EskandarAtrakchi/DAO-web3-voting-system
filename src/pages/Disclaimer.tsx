import { Link } from "react-router-dom";

export default function Disclaimer() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Terms of Service and Disclaimer
          </h1>
        </div>
        <div className="space-y-6 text-muted-foreground">
          <p>
            Welcome to our Calorie Calculator app. By using our app, you agree
            to the following terms and conditions:
          </p>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              Terms of Service
            </h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                The Calorie Calculator app is provided as-is, without any
                warranties or guarantees. We do not guarantee the accuracy or
                completeness of the information provided.
              </li>
              <li>
                The app is intended for informational and educational purposes
                only. It should not be used as a substitute for professional
                medical advice, diagnosis, or treatment.
              </li>
              <li>
                You are solely responsible for any decisions or actions you take
                based on the information provided by the app.
              </li>
              <li>
                We reserve the right to modify or discontinue the app at any
                time without notice.
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              Disclaimer
            </h2>
            <p>
              The Calorie Calculator app is not intended to be a substitute for
              professional medical advice, diagnosis, or treatment. Always seek
              the advice of your physician or other qualified health provider
              with any questions you may have regarding a medical condition.
              Never disregard professional medical advice or delay in seeking it
              because of something you have read in this app.
            </p>
          </div>
        </div>
        <div className="flex justify-center">
          <Link
            to={"/"}
            className="bg-black text-white hover:text-black hover:bg-white inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            onClick={() => window.close()}
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ArrowLeftIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

// function XIcon(props: any) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M18 6 6 18" />
//       <path d="m6 6 12 12" />
//     </svg>
//   );
// }