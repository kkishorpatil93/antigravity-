import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, X, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface ImageUploaderProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  error?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onFileSelect,
  selectedFile,
  error,
}) => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setLocalError(null);

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setLocalError('Invalid format. Please upload JPEG, PNG, or WebP.');
      return;
    }

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setLocalError('File exceeds 5MB limit. Please upload a smaller photo.');
      return;
    }

    onFileSelect(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setLocalError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleInputChange}
      />

      {previewUrl ? (
        <div className="relative rounded-xl border-2 border-agri-400 overflow-hidden bg-gray-900 flex items-center justify-center group h-64 sm:h-72">
          <img
            src={previewUrl}
            alt="Crop sample preview"
            className="w-full h-full object-contain"
          />
          <button
            type="button"
            onClick={clearFile}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 shadow-md transition-transform transform hover:scale-105"
            title="Remove image"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2.5 py-1 rounded-md backdrop-blur-xs flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-agri-400" />
            <span>{selectedFile?.name}</span>
            <span className="text-gray-400">
              ({((selectedFile?.size || 0) / (1024 * 1024)).toFixed(2)} MB)
            </span>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center p-8 sm:p-10 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 bg-cream-50/70 hover:bg-cream-100 ${
            error || localError
              ? 'border-red-400 bg-red-50/30'
              : 'border-agri-300 hover:border-agri-500'
          }`}
        >
          <div className="w-14 h-14 rounded-full bg-agri-100 text-agri-700 flex items-center justify-center mb-3">
            <UploadCloud className="w-7 h-7" />
          </div>
          <p className="text-sm font-semibold text-agri-950 mb-1 text-center">
            {t.forms.dragDropText}
          </p>
          <p className="text-xs text-gray-500 text-center mb-3">
            {t.forms.photoReqText}
          </p>
          <span className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-agri-700 text-white shadow-xs">
            Browse Photo
          </span>
        </div>
      )}

      {(error || localError) && (
        <p className="mt-2 text-xs text-red-600 flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error || localError}</span>
        </p>
      )}
    </div>
  );
};

