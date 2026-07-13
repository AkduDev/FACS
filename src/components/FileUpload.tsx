import React, { useState, useRef, useEffect, DragEvent } from 'react';
import { Upload, X, FileText, Loader2, CheckCircle, ImageIcon } from 'lucide-react';
import { useToast } from './Toast';

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  onUploadError?: (error: string) => void;
  onClear?: () => void;
  accept?: string;
  maxSize?: number;
  label?: string;
  className?: string;
  initialPreview?: string;
}

interface UploadState {
  isUploading: boolean;
  progress: number;
  preview: string | null;
  error: string | null;
  uploadedUrl: string | null;
}

export default function FileUpload({
  onUploadComplete,
  onUploadError,
  onClear,
  accept = "image/jpeg,image/jpg,image/png,image/gif,image/webp",
  maxSize = 10 * 1024 * 1024,
  label = "Subir imagen",
  className = "",
  initialPreview,
}: FileUploadProps) {
  const { showToast } = useToast();
  const [state, setState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    preview: initialPreview || null,
    error: null,
    uploadedUrl: initialPreview || null,
  });
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const autoUploadRef = useRef(false);

  // Sync with initialPreview changes
  useEffect(() => {
    if (initialPreview) {
      setState(prev => ({
        ...prev,
        preview: initialPreview,
        uploadedUrl: initialPreview,
      }));
    }
  }, [initialPreview]);

  const processFile = (file: File) => {
    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / 1024 / 1024);
      setState((prev) => ({
        ...prev,
        error: `El archivo excede el tamaño máximo de ${maxSizeMB}MB`,
      }));
      return;
    }

    const allowedTypes = accept.split(',');
    if (!allowedTypes.includes(file.type)) {
      setState((prev) => ({
        ...prev,
        error: "Tipo de archivo no permitido",
      }));
      return;
    }

    setState((prev) => ({ ...prev, error: null, uploadedUrl: null }));

    const reader = new FileReader();
    reader.onload = (e) => {
      setState((prev) => ({
        ...prev,
        preview: e.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);

    // Start upload automatically
    autoUploadRef.current = true;
    uploadFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const uploadFile = async (file: File) => {
    setState((prev) => ({ ...prev, isUploading: true, progress: 0 }));

    try {
      const formData = new FormData();
      formData.append('image', file);

      const progressInterval = setInterval(() => {
        setState((prev) => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90),
        }));
      }, 100);

      const response = await fetch('/api/uploads/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('fcas_jwt_token')}`,
        },
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al subir archivo');
      }

      const result = await response.json();
      
      setState((prev) => ({
        ...prev,
        isUploading: false,
        progress: 100,
        uploadedUrl: result.file.url,
      }));

      onUploadComplete(result.file.url);
      showToast('Imagen subida correctamente', 'success');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al subir archivo';
      setState((prev) => ({
        ...prev,
        isUploading: false,
        error: errorMessage,
      }));
      onUploadError?.(errorMessage);
    }
  };

  const handleClear = () => {
    setState({
      isUploading: false,
      progress: 0,
      preview: null,
      error: null,
      uploadedUrl: null,
    });
    autoUploadRef.current = false;
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClear?.();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const hasImage = state.preview || state.uploadedUrl;

  return (
    <div className={`relative ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept={accept}
        className="hidden"
        disabled={state.isUploading}
      />

      {!hasImage ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          disabled={state.isUploading}
          className={`w-full border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer group ${
            isDragging
              ? 'border-cyan-400 bg-cyan-950/30 scale-[1.02]'
              : 'border-marine-700 hover:border-cyan-500 bg-marine-900/40 hover:bg-marine-900/60'
          }`}
        >
          <div className="flex flex-col items-center space-y-3">
            <div className={`p-4 rounded-full transition-colors ${
              isDragging
                ? 'bg-cyan-900/60'
                : 'bg-marine-800/60 group-hover:bg-cyan-900/40'
            }`}>
              <Upload className={`h-8 w-8 transition-colors ${
                isDragging
                  ? 'text-cyan-300'
                  : 'text-marine-400 group-hover:text-cyan-400'
              }`} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white mb-1">
                {isDragging ? 'Suelta el archivo aquí' : label}
              </p>
              <p className="text-xs text-marine-400">
                {isDragging ? 'Soltar para subir' : 'Arrastra o haz clic para seleccionar'}
              </p>
              <p className="text-[10px] text-marine-500 mt-1">
                JPG, PNG, GIF, WebP (Máx. {Math.round(maxSize / 1024 / 1024)}MB)
              </p>
            </div>
          </div>
        </button>
      ) : (
        <div className="border border-marine-700 rounded-2xl p-4 bg-marine-900/40">
          <div className="flex items-start gap-4">
            {state.preview ? (
              <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-marine-700 shrink-0">
                <img
                  src={state.uploadedUrl || state.preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                {state.isUploading && (
                  <div className="absolute inset-0 bg-marine-950/70 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 text-cyan-400 animate-spin" />
                  </div>
                )}
                {state.uploadedUrl && !state.isUploading && (
                  <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-emerald-400" />
                  </div>
                )}
              </div>
            ) : (
              <div className="w-24 h-24 rounded-xl bg-marine-800/60 flex items-center justify-center border border-marine-700 shrink-0">
                <FileText className="h-8 w-8 text-marine-400" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              {state.uploadedUrl && !state.isUploading ? (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  <p className="text-sm text-emerald-400 font-medium">
                    Imagen subida correctamente
                  </p>
                </div>
              ) : state.isUploading ? (
                <div>
                  <p className="text-sm text-white font-medium">Subiendo...</p>
                  <div className="mt-2">
                    <div className="h-2 bg-marine-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-marine-500 transition-all duration-300"
                        style={{ width: `${state.progress}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-marine-400 mt-1">{state.progress}%</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-marine-400">Imagen lista</p>
              )}

              {state.error && (
                <p className="text-xs text-red-400 mt-2">{state.error}</p>
              )}
            </div>

            {!state.isUploading && (
              <button
                type="button"
                onClick={handleClear}
                className="p-2 rounded-lg hover:bg-red-950/40 text-marine-400 hover:text-red-400 transition-colors"
                title="Quitar imagen"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
