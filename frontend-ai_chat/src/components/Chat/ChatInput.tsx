// src/components/ChatInput.tsx
import React, { useState, useRef } from "react";

import { SendIcon } from "../icons/Icons"; // Add ImageIcon

interface ChatInputProps {
  onSendMessage: (message: string, imageBase64?: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
}) => {
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null); // Store the URL for preview

  const imageInputRef = useRef<HTMLInputElement>(null); // Ref for the hidden file input
  const InputRef = useRef<HTMLInputElement>(null); // Ref for the  input

  const handleImageClick = () => {
    imageInputRef.current?.click(); // Programmatically click the hidden input
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      // Basic validation for image type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file.");
        setSelectedImage(null);
        setImagePreviewUrl(null);

        return;
      }
      setSelectedImage(file);
      // Optional: Display file name or a preview
      // Create a URL for the image preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);
    } else {
      setSelectedImage(null);
      setImagePreviewUrl(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isLoading || (!input.trim() && !selectedImage)) return; // Prevent sending empty or just loading
    let imageBase64: string | undefined = undefined;

    if (selectedImage) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedImage);
      reader.onloadend = async () => {
        imageBase64 = reader.result as string; // This will be data:image/png;base64,...
        // Now send the message with the image

        onSendMessage(input.trim(), imageBase64);
        setInput(""); // Clear input field
        setSelectedImage(null); // Clear selected image
        if (imageInputRef.current) {
          // Reset file input
          imageInputRef.current.value = "";
        }
        InputRef.current?.focus();
      };
      reader.onerror = (error) => {
        console.error("Error reading image file:", error);
        alert("Failed to load image. Please try again.");
      };
    } else {
      // If no image, just send the text message
      onSendMessage(input.trim());

      setInput("");
      InputRef.current?.focus();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 w-11/12 m-auto mb-4 border-2 border-zinc-600 rounded-3xl flex flex-col space-y-2"
    >
      {/* Image Preview Section */}
      {imagePreviewUrl && (
        <div className="flex items-center space-x-3 p-2   rounded-lg ">
          {" "}
          {/* Changed border-red-800 to purple-500 for better visibility */}
          <img
            src={imagePreviewUrl}
            alt="Selected preview"
            className="w-16 h-16 object-cover rounded-md "
          />
          <span className="ml-4 text-sm text-gray-400 truncate max-w-[calc(100%-6rem)]">
            {selectedImage?.name || "Selected Image"}
          </span>
          <button
            type="button"
            onClick={() => {
              setSelectedImage(null);
              setImagePreviewUrl(null);
              if (imageInputRef.current) imageInputRef.current.value = "";
            }}
            className="text-gray-500 hover:text-red-400 text-lg "
            title="Remove image"
          >
            &times;
          </button>
        </div>
      )}
      {/* Hidden file input */}
      {/* Main input and buttons section */}
      <div className="flex  items-center space-x-2">
        <input
          type="file"
          ref={imageInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
        />

        {/* Image upload button */}
        <button
          type="button" // Important: type="button" to prevent form submission
          onClick={handleImageClick}
          className="p-2 rounded-full text-gray-400 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-600"
          title="Upload Image"
          disabled={isLoading}
        >
          {/* <ImageIcon className="w-5 h-5" /> */}
          <img src="/image-24.png" className="w-5 h-5" />
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          ref={InputRef}
          placeholder={
            selectedImage
              ? "Add a message about the image..."
              : "Type your message..."
          }
          className="flex-1 p-3 rounded-xl bg-zinc-800 text-gray-100 border-none outline-none placeholder-gray-400   "
          disabled={isLoading}
        />
        <button
          type="submit"
          className="p-3 rounded-full bg-zinc-600 text-white hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 disabled:opacity-50"
          disabled={isLoading || (!input.trim() && !selectedImage)} // Disable if no text and no image
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};
