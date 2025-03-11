import React, { useState } from 'react';

const FileUpload: React.FC = () => {
	const [dragOver, setDragOver] = useState(false);

	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setDragOver(true);
	};

	const handleDragLeave = () => {
		setDragOver(false);
	};

	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setDragOver(false);
		const files = event.dataTransfer.files;
		handleFiles(files);
	};

	const handleFiles = (files: FileList) => {
		console.log('Files uploaded:', files);
		// Add your file handling logic here
	};

	const handleBrowseFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files) {
			handleFiles(files);
		}
	};

	return (
		<div
			className={`uploadBox ${dragOver ? 'dragover' : ''}`}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
		>
			<p>Drag and drop files here</p>
			<button onClick={() => document.getElementById('fileInput')?.click()}>Browse files</button>
			<input
				type="file"
				id="fileInput"
				style={{ display: 'none' }}
				multiple
				onChange={handleBrowseFiles}
			/>
		</div>
	);
};

export default FileUpload;