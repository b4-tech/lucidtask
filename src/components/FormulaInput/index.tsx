import React, { ChangeEvent, FC, useEffect } from 'react';
import { useStore } from '@/store/formulaStore';
import Downshift from 'downshift';
import { useQuery } from '@tanstack/react-query';
import { fetchTags } from '@/api/fetchTags';
import { List, ListItem, ListItemText } from '@mui/material';
import './styles.css';
import { Tag } from '@/types/tags';

interface Props {
  formulaId: number;
}

const FormulaInput: FC<Props> = ({ formulaId }) => {
  const { elements, setElements, editElement } = useStore((state) => ({
    elements: state.elements[formulaId] || [],
    setElements: state.setElements,
    editElement: state.editElement,
  }));

  const [inputValue, setInputValue] = React.useState('');
  const { data: tags, isLoading } = useQuery<Tag[]>({
    queryKey: ['autocomplete'],
    queryFn: fetchTags,
  });

  useEffect(() => {
    const handleKeyUp = (event: { key: string; preventDefault: () => void }) => {
      if (['+', '-', '*', '/', '(', ')', '^'].includes(event.key)) {
        if (inputValue) {
          addWord(inputValue, false);
        }
        addWord(event.key, false);
      } else if (event.key === ' ' && inputValue) {
        event.preventDefault();
        addWord(inputValue, false);
      }
    };

    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [inputValue]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleEditChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    editElement(formulaId, index, { ...elements[index], editableText: event.target.value });
  };

  const handleEditToggle = (index: number) => {
    editElement(formulaId, index, { ...elements[index], isEditing: !elements[index].isEditing });
  };

  const handleEditConfirm = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      editElement(formulaId, index, {
        ...elements[index],
        text: elements[index].editableText,
        isEditing: false,
      });
    }
  };

  const addWord = (word: string, fromAutocomplete: boolean) => {
    if (word.trim()) {
      const newWord = {
        text: word,
        fromAutocomplete: fromAutocomplete,
        isEditing: false,
        editableText: 'x',
      };
      setElements(formulaId, [...elements, newWord]);
      setInputValue('');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Downshift
      inputValue={inputValue}
      onSelect={(selection) => addWord(selection.name, true)}
      itemToString={(item) => (item ? item.name : '')}
    >
      {({ getInputProps, getItemProps, getMenuProps, isOpen, inputValue, highlightedIndex }) => (
        <div style={{ border: '1px solid black', padding: '10px', minWidth: '300px' }}>
          {elements.map((word, index) => (
            <span
              key={index}
              className={word.fromAutocomplete ? 'autocomplete' : ''}
              style={{ marginRight: '5px' }}
            >
              {word.text}
              {word.fromAutocomplete && (
                <span className="editPart">
                  {'['}
                  {word.isEditing ? (
                    <input
                      value={word.editableText}
                      onChange={(e) => handleEditChange(index, e)}
                      onKeyDown={(e) => handleEditConfirm(index, e)}
                      onBlur={() => handleEditToggle(index)}
                      autoFocus
                    />
                  ) : (
                    <span onClick={() => handleEditToggle(index)}>{word.editableText}</span>
                  )}
                  {']'}
                </span>
              )}
            </span>
          ))}
          <input
            {...getInputProps({
              onChange: handleChange,
              onKeyDown: (event) => {
                if (event.key === 'Enter' && inputValue) {
                  event.preventDefault();
                  addWord(inputValue, false);
                } else if (event.key === 'Backspace' && !inputValue && elements.length > 0) {
                  event.preventDefault();
                  setElements(formulaId, elements.slice(0, -1));
                }
              },
            })}
            style={{ border: 'none', outline: 'none', width: 'auto' }}
          />
          <List
            {...getMenuProps()}
            sx={{
              position: 'absolute',
              listStyle: 'none',
              zIndex: 100,
              margin: 0,
              display: (inputValue?.length ?? 0) >= 2 ? 'block' : 'none',
              maxHeight: '400px',
              overflowY: 'auto',
            }}
          >
            {isOpen && (inputValue?.length ?? 0) >= 2
              ? tags
                  ?.filter((tag) =>
                    tag.name.toLowerCase().includes(inputValue?.toLowerCase() ?? '')
                  )
                  .map((item, index) => (
                    <ListItem
                      key={index}
                      {...getItemProps({
                        index,
                        item,
                        style: {
                          backgroundColor: highlightedIndex === index ? 'lightgray' : 'white',
                          width: 300,
                        },
                      })}
                    >
                      <ListItemText primary={item.name} />
                    </ListItem>
                  ))
              : null}
          </List>
        </div>
      )}
    </Downshift>
  );
};

export default FormulaInput;
