import React from 'react';
import FileUpload from '../FileUpload';
import { ImageUploaderProps } from './types';

export default function ImageUploader({
  onUploadComplete,
  onUploadError,
  onClear,
  label,
  uploadLabel,
  initialPreview,
}: ImageUploaderProps) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{label}</label>
      <FileUpload
        onUploadComplete={onUploadComplete}
        onUploadError={onUploadError}
        onClear={onClear}
        label={uploadLabel}
        initialPreview={initialPreview}
      />
    </div>
  );
}
