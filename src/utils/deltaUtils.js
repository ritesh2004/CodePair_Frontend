// Utility functions for calculating and applying text deltas
// This can be used for testing the delta functionality

// Calculate differences between two strings
export const calculateDelta = (oldText, newText) => {
    if (oldText === newText) return null;
    
    // Find common prefix
    let prefixEnd = 0;
    const minLength = Math.min(oldText.length, newText.length);
    while (prefixEnd < minLength && oldText[prefixEnd] === newText[prefixEnd]) {
        prefixEnd++;
    }
    
    // Find common suffix
    let suffixStart = 0;
    let oldIndex = oldText.length - 1;
    let newIndex = newText.length - 1;
    
    while (suffixStart < minLength - prefixEnd && 
           oldText[oldIndex - suffixStart] === newText[newIndex - suffixStart]) {
        suffixStart++;
    }
    
    const oldSuffixStart = oldText.length - suffixStart;
    const newSuffixStart = newText.length - suffixStart;
    
    return {
        start: prefixEnd,
        deleteCount: oldSuffixStart - prefixEnd,
        insertText: newText.substring(prefixEnd, newSuffixStart),
        timestamp: Date.now()
    };
};

// Apply delta changes to text
export const applyDelta = (text, delta) => {
    if (!delta) return text;
    return text.substring(0, delta.start) + 
           delta.insertText + 
           text.substring(delta.start + delta.deleteCount);
};

// Test function to demonstrate delta calculation
export const testDelta = () => {
    const oldText = "Hello World";
    const newText = "Hello Beautiful World";
    
    const delta = calculateDelta(oldText, newText);
    console.log('Delta:', delta);
    
    const result = applyDelta(oldText, delta);
    console.log('Original:', oldText);
    console.log('Applied:', result);
    console.log('Expected:', newText);
    console.log('Match:', result === newText);
    
    return { delta, result, match: result === newText };
};
