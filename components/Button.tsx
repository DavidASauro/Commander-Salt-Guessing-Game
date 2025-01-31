import React from "react";
interface Props {
  handleClick: () => void;
  class: string;
  name: string;
}
const Button = (props: Props) => {
  return (
    <button className={props.class} onClick={props.handleClick}>
      {props.name}
    </button>
  );
};

export default Button;
