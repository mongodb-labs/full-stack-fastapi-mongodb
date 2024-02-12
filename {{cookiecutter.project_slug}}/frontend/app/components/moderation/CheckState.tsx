import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

interface CheckStateProps {
  check: boolean;
}

export default function CheckState(props: CheckStateProps) {
  return (
    <div>
      {props.check ? (
        <CheckCircleIcon
          className="text-green-600 flex-shrink-0 -ml-1 mr-3 h-6 w-6"
          aria-hidden="true"
        />
      ) : (
        <XCircleIcon
          className="text-red-600 flex-shrink-0 -ml-1 mr-3 h-6 w-6"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
