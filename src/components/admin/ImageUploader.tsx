import React from 'react';
import FileUpload from '../FileUpload';
import { ImageUploaderProps } from './types';

export default function ImageUploader({
  mode,
  onModeChange,
  url,
  onUrlChange,
  onUploadComplete,
  onUploadError,
  label,
  uploadLabel,
}: ImageUploaderProps) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{label}</label>
      
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => onModeChange('url')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            mode === 'url'
              ? 'bg-cyan-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Usar URL
        </button>
        <button
          type="button"
          onClick={() => onModeChange('upload')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            mode === 'upload'
              ? 'bg-cyan-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Subir Archivo
        </button>
      </div>

      {mode === 'url' ? (
        <input
          type="url"
          placeholder="https://images.unsplash.com/..."
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      ) : (
        <FileUpload
          onUploadComplete={onUploadComplete}
          onUploadError={onUploadError}
          label={uploadLabel}
        />
      )}
    </div>
  );
}
