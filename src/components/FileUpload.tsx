import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, FileText, Loader2 } from 'lucide-react';
import { api } from '../api';

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  onUploadError?: (error: string) => void;
  accept?: string;
  maxSize?: number;
  label?: string;
  className?: string;
}

interface UploadState {
  isUploading: boolean;
  progress: number;
  preview: string | null;
  error: string | null;
}

export default function FileUpload({
  onUploadComplete,
  onUploadError,
  accept = "image/jpeg,image/jpg,image/png,image/gif,image/webp",
  maxSize = 10 * 1024 * 1024, // 10MB
  label = "Subir imagen",
  className = "",
}: FileUploadProps) {
  const [state, setState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    preview: null,
    error: null,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamaño
    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / 1024 / 1024);
      setState((prev) => ({
        ...prev,
        error: `El archivo excede el tamaño máximo de ${maxSizeMB}MB`,
      }));
      return;
    }

    // Validar tipo
    const allowedTypes = accept.split(',');
    if (!allowedTypes.includes(file.type)) {
      setState((prev) => ({
        ...prev,
        error: "Tipo de archivo no permitido",
      }));
      return;
    }

    setSelectedFile(file);
    setState((prev) => ({ ...prev, error: null }));

    // Crear preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setState((prev) => ({
        ...prev,
        preview: e.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setState((prev) => ({ ...prev, isUploading: true, progress: 0 }));

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      // Simular progreso (ya que fetch no soporta progreso nativo)
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
      }));

      // Notificar al componente padre
      onUploadComplete(result.file.url);

      // Limpiar después de un breve delay
      setTimeout(() => {
        setState({
          isUploading: false,
          progress: 0,
          preview: null,
          error: null,
        });
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 1000);

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
    setSelectedFile(null);
    setState({
      isUploading: false,
      progress: 0,
      preview: null,
      error: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className={`relative ${className}`}>
      {/* Input de archivo oculto */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept={accept}
        className="hidden"
        disabled={state.isUploading}
      />

      {/* Área de dropzone */}
      {!selectedFile ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={state.isUploading}
          className="w-full border-2 border-dashed border-marine-700 hover:border-cyan-500 rounded-2xl p-8 text-center transition-all duration-200 bg-marine-900/40 hover:bg-marine-900/60 cursor-pointer group"
        >
          <div className="flex flex-col items-center space-y-3">
            <div className="p-4 rounded-full bg-marine-800/60 group-hover:bg-cyan-900/40 transition-colors">
              <Upload className="h-8 w-8 text-marine-400 group-hover:text-cyan-400 transition-colors" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white mb-1">
                {label}
              </p>
              <p className="text-xs text-marine-400">
                Arrastra o haz clic para seleccionar
              </p>
              <p className="text-[10px] text-marine-500 mt-1">
                JPG, PNG, GIF, WebP (Máx. {Math.round(maxSize / 1024 / 1024)}MB)
              </p>
            </div>
          </div>
        </button>
      ) : (
        <div className="border border-marine-700 rounded-2xl p-4 bg-marine-900/40">
          {/* Preview del archivo */}
          <div className="flex items-start gap-4">
            {state.preview && selectedFile.type.startsWith('image/') ? (
              <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-marine-700 shrink-0">
                <img
                  src={state.preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                {state.isUploading && (
                  <div className="absolute inset-0 bg-marine-950/70 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 text-cyan-400 animate-spin" />
                  </div>
                )}
              </div>
            ) : (
              <div className="w-20 h-20 rounded-xl bg-marine-800/60 flex items-center justify-center border border-marine-700 shrink-0">
                <FileText className="h-8 w-8 text-marine-400" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-marine-400 mt-0.5">
                {formatFileSize(selectedFile.size)}
              </p>

              {/* Barra de progreso */}
              {state.isUploading && (
                <div className="mt-3">
                  <div className="h-2 bg-marine-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-marine-500 transition-all duration-300"
                      style={{ width: `${state.progress}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-marine-400 mt-1">
                    Subiendo... {state.progress}%
                  </p>
                </div>
              )}

              {/* Estado de éxito */}
              {state.progress === 100 && !state.isUploading && (
                <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Imagen subida correctamente
                </p>
              )}
            </div>

            {/* Botón de cancelar */}
            {!state.isUploading && (
              <button
                type="button"
                onClick={handleClear}
                className="p-2 rounded-lg hover:bg-red-950/40 text-marine-400 hover:text-red-400 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Botones de acción */}
          {!state.isUploading && state.progress !== 100 && (
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2 rounded-xl border border-marine-700 text-marine-300 text-sm font-medium hover:bg-marine-800/60 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleUpload}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold transition-colors flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Subir Imagen
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mensaje de error */}
      {state.error && (
        <div className="mt-3 p-3 rounded-xl bg-red-950/40 border border-red-800/50 text-red-400 text-xs flex items-center gap-2">
          <X className="h-4 w-4 shrink-0" />
          {state.error}
        </div>
      )}
    </div>
  );
}
