import { useEffect, useState } from 'react';

const defaultHandleSearch = () => {};

const defaultPreprocessResults = results => results;

export const useAutocompleteLogic = (
  handleSearch = defaultHandleSearch,
  queryField = 'q',
  optionLabelField = 'name',
  identifier = 'id',
  preprocessResults = defaultPreprocessResults
) => {
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!inputValue.trim()) setOptions(value ? [value] : []);
    else if (!value || inputValue !== value[optionLabelField]) {
      setIsSearching(true);

      handleSearch({ [queryField]: inputValue }, results => {
        const newOptions = preprocessResults(results);

        setOptions(
          value &&
            !newOptions.some(result => result[identifier] === value[identifier])
            ? [...newOptions, value]
            : newOptions
        );

        setIsSearching(false);
      });
    }
  }, [
    handleSearch,
    identifier,
    inputValue,
    optionLabelField,
    preprocessResults,
    queryField,
    value
  ]);

  const handleValueChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };

  return {
    options,
    value,
    inputValue,
    isSearching,
    handleValueChange,
    handleInputChange,
    setOptions,
    setValue,
    setInputValue,
    setIsSearching
  };
};
