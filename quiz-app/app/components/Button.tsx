import type { ButtonHTMLAttributes, FC, MouseEventHandler } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  bgColor: "blue" | "green";
}

const btnStyle =
  "min-w-[30%] flex items-center justify-center text-center focus:ring-2 font-medium text-xs sm:text-sm px-2.5 py-1 sm:px-5 sm:py-2.5 inline-flex items-center";

const getColor = (color: ButtonProps["bgColor"]) => {
  switch (color) {
    case "blue":
      return "bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800";
    case "green":
      return "bg-green-700 hover:bg-green-800 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800";
    default:
      return "";
  }
};

export const Button: FC<ButtonProps> = ({ bgColor, className, ...props }) => {
  const style = clsx(
    btnStyle,
    getColor(bgColor),
    "text-white",
    "rounded-lg",
    className
  );
  return <button className={style} {...props} />;
};

type LoadingButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "disabled" | "type"
> & { text: string };

export const LoadingButton: FC<LoadingButtonProps> = ({
  text,
  className,
  ...props
}) => {
  const style = clsx(
    btnStyle,
    "text-gray-900",
    "rounded-lg",
    "bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700",
    className
  );
  return (
    <button disabled type="button" className={style} {...props}>
      <svg
        aria-hidden="true"
        role="status"
        className="inline w-4 h-4 mr-3 text-gray-200 animate-spin dark:text-gray-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="#1C64F2"
        />
      </svg>{" "}
      {text}
    </button>
  );
};

type NextButtonProps = {
  bgColor: ButtonProps["bgColor"];
  text: string;
  topic?: string | undefined | null;
  showDropdown: boolean;
  onToggleDropdown: MouseEventHandler<HTMLButtonElement>;
  entries: string[];
};

export const NextButton: FC<NextButtonProps> = ({
  bgColor,
  text,
  topic,
  entries,
  showDropdown,
  onToggleDropdown,
}) => {
  const getDropdownColor = (color: ButtonProps["bgColor"]) => {
    switch (color) {
      case "blue":
        return "bg-blue-800 hover:bg-blue-900 focus:ring-blue-400 dark:bg-blue-500 dark:hover:bg-blue-800 dark:focus:ring-blue-900";
      case "green":
        return "bg-green-800 hover:bg-green-900 focus:ring-green-400 dark:bg-green-500 dark:hover:bg-green-800 dark:focus:ring-green-900";
      default:
        return "";
    }
  };
  return (
    <div className="flex flex-row">
      <button
        type="submit"
        name="topic"
        value={topic ?? ""}
        className={clsx(
          btnStyle,
          getColor(bgColor),
          "text-white",
          "rounded-l-lg"
        )}
      >
        {text}
        <svg
          aria-hidden="true"
          className="w-5 h-5 ml-2 -mr-1"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>
      <div className="relative">
        <button
          onClick={onToggleDropdown}
          data-dropdown-toggle="dropdown"
          className={clsx(
            "text-white  focus:ring-4 focus:outline-none font-medium rounded-r-lg text-sm pr-4 py-2.5 text-center inline-flex items-center ",
            getDropdownColor(bgColor)
          )}
          type="button"
        >
          <span className="invisible">|</span>
          <svg
            className="w-4 h-4 ml-2"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </button>

        <div
          className={clsx(
            "absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700",
            { hidden: !showDropdown }
          )}
        >
          <ul
            className="px-0 py-1 m-0 text-sm text-gray-700 dark:text-gray-200 list-none"
            aria-labelledby="dropdownDefaultButton"
          >
            {entries.map((entry, index) => (
              <li key={index} className="p-0 box-border">
                <button
                  type="submit"
                  name="topic"
                  value={entry}
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left"
                  role="menuitem"
                >
                  {entry}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
