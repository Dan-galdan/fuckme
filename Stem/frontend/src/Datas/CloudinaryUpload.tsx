import React, { useState } from 'react';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';

interface CloudinaryUploadProps {
    onImageUpload: (imageUrl: string) => void;
    currentImage?: string;
}

// Type assertion to fix the AdvancedImage component type issues
const CloudinaryImage = AdvancedImage as any;

const CloudinaryUpload: React.FC<CloudinaryUploadProps> = ({ onImageUpload, currentImage }) => {
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState(currentImage || '');
    const cld = new Cloudinary({ cloud: { cloudName: 'dwm5xkbgo' } });

    const uploadToCloudinary = async (file: File) => {
        setUploading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'physics_questions');

        try {
            const response = await fetch('https://api.cloudinary.com/v1_1/dwm5xkbgo/image/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.secure_url) {
                setImageUrl(data.secure_url);
                onImageUpload(data.secure_url);
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Image upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert('Image must be smaller than 5MB');
                return;
            }
            uploadToCloudinary(file);
        }
    };

    // Create Cloudinary image for display
    const getCloudinaryImage = (url: string) => {
        if (!url) return null;

        // Extract public ID from URL
        const parts = url.split('/');
        const publicId = parts[parts.length - 1].split('.')[0];

        return cld
            .image(publicId)
            .resize(auto().gravity(autoGravity()).width(300).height(200))
            .format('auto')
            .quality('auto');
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Question Image (Optional)
            </label>

            {/* Current Image Preview using CloudinaryImage */}
            {imageUrl && (
                <div className="mb-2 p-2 border rounded-lg bg-gray-50">
                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                    <CloudinaryImage
                        cldImg={getCloudinaryImage(imageUrl)}
                        className="max-w-full max-h-48 object-contain mx-auto"
                    />
                </div>
            )}

            {/* Upload Controls */}
            <div className="flex items-center gap-4">
                <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 disabled:bg-blue-400">
                    <span>{uploading ? 'Uploading...' : 'Choose Image'}</span>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="hidden"
                    />
                </label>

                {imageUrl && (
                    <button
                        type="button"
                        onClick={() => {
                            setImageUrl('');
                            onImageUpload('');
                        }}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        Remove
                    </button>
                )}
            </div>

            <p className="text-xs text-gray-500">
                Supports JPG, PNG, GIF. Max 5MB. Recommended for diagrams, graphs, physics illustrations.
            </p>
        </div>
    );
};

export default CloudinaryUpload;