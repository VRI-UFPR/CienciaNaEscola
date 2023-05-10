import React from 'react';

function FileUpload() {
  return (
    <div>
      <input type="file" name="fileToUpload" id="fileToUpload" />
      <button type="submit">Upload</button>
    </div>
  );
}

export default FileUpload;
