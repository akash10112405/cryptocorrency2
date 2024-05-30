import React from "react";
import Select from "react-select";

const CryptoDropdown = (props) => {
  console.log(props);
  return (
    <div className="option">
      <Select
        options={props.options}
        onChange={props.onChange}
        value={props.value}
        placeholder="Select a cryptocurrency"
      />
    </div>
  );
};

export default CryptoDropdown;
