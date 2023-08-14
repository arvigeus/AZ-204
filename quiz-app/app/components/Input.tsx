import { useState, useEffect, useRef } from "react";
import type { ChangeEvent } from "react";

import clsx from "clsx";

export const InputStyle = "block mt-4 border border-gray-300 py-2 px-6 text-lg";

export const TextInput = () => {
  const [text, setText] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${
        textareaRef.current.scrollHeight + 2
      }px`;
    }
  }, [text]);

  const onChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  return (
    <textarea
      placeholder="Your answer here..."
      ref={textareaRef}
      value={text}
      className={clsx(
        InputStyle,
        "rounded-lg w-full focus:outline-none resize-none"
      )}
      onChange={onChangeHandler}
    />
  );
};
