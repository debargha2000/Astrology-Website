import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import React, { useRef, useState } from 'react';

import { storage } from '../../lib/firebase';

interface Props {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}

export function ImageUpload({ value, onChange, folder = 'uploads', label = 'Image' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB.');
      return;
    }

    setError(null);
    setUploading(true);
    setProgress(0);

    try {
      const ext = file.name.split('.').pop() || 'png';
      const filename = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const storageRef = ref(storage, filename);
      const task = uploadBytesResumable(storageRef, file);

      await new Promise<void>((resolve, reject) => {
        task.on(
          'state_changed',
          (snap) => {
            setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100));
          },
          (err) => reject(err),
          () => resolve()
        );
      });

      const downloadUrl = await getDownloadURL(task.snapshot.ref);
      onChange(downloadUrl);
    } catch (e: any) {
      setError(e.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-2">
      <label className="block text-clay font-mono text-[10px] uppercase font-bold">
        {label} URL *
      </label>

      {value && (
        <div className="relative group">
          <img
            src={value}
            alt="Preview"
            className="w-full h-32 object-cover rounded-xl border border-stone"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <button
            onClick={() => onChange('')}
            className="absolute top-2 right-2 bg-white/90 hover:bg-white text-red-600 p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
          dragOver ? 'border-gold bg-cream/50' : 'border-stone hover:border-gold-muted'
        } ${uploading ? 'pointer-events-none opacity-60' : ''}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleSelect}
          className="hidden"
        />
        {uploading ? (
          <div className="space-y-2">
            <div className="h-2 bg-cream rounded-full overflow-hidden">
              <div
                className="h-full bg-gold rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-clay">Uploading {progress}%...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-clay">
            {value ? <ImageIcon className="h-5 w-5" /> : <Upload className="h-5 w-5" />}
            <span className="text-[10px] font-mono">
              {value ? 'Click or drag to replace' : 'Click or drag image here'}
            </span>
            <span className="text-[9px] font-mono text-gold-muted">PNG, JPG up to 5MB</span>
          </div>
        )}
      </div>

      {error && <p className="text-[10px] font-mono text-red-600">{error}</p>}

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste image URL directly"
        className="w-full bg-cream border border-stone p-2 rounded-lg text-xs font-mono outline-none focus:border-ink"
      />
    </div>
  );
}
