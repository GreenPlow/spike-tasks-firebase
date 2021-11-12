import React from 'react';
import PropTypes from 'prop-types';

import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap';

export function SizeSelector({
  disabled,
  onSizeChangeCallBack,
  selectedValue,
  styleAttributes,
  id,
}) {
  return (
    <ToggleButtonGroup
      key={`formField-${id}`}
      type="radio"
      name={`options-${id}`}
      value={selectedValue}
      onChange={onSizeChangeCallBack}
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
          key={`formField-${sizeOption.value}`}
          id={`formField-${sizeOption.value}-${id}`}
          name={`formField-${sizeOption.value}-${id}`}
          tabIndex={index + 2}
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
  onSizeChangeCallBack: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  styleAttributes: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  id: PropTypes.string.isRequired,
};

SizeSelector.defaultProps = {
  selectedValue: '',
  disabled: false,
  styleAttributes: {},
};
