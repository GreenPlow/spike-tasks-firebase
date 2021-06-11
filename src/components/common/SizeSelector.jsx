import React from 'react';
import PropTypes from 'prop-types';

import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap';

export function SizeSelector({
  disabled,
  onSizeChange,
  selectedValue,
  styleAttributes,
}) {
  return (
    <ToggleButtonGroup
      type="radio"
      name="options"
      value={selectedValue}
      onChange={onSizeChange}
      onClick={(e) => {
        e.stopPropagation();
      }}
      style={styleAttributes}
    >
      {[
        { value: 'small', label: 'S' },
        { value: 'medium', label: 'M' },
        { value: 'large', label: 'L' },
      ].map((sizeOption, index) => (
        <ToggleButton
          key={`formField${sizeOption.value}`}
          tabIndex={index + 2}
          name={sizeOption.value}
          label={sizeOption.label}
          value={sizeOption.value}
          disabled={disabled}
        >
          {sizeOption.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

SizeSelector.propTypes = {
  selectedValue: PropTypes.oneOf(['small', 'medium', 'large', '']),
  onSizeChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  styleAttributes: PropTypes.object,
};

SizeSelector.defaultProps = {
  selectedValue: '',
};
