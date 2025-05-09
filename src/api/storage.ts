
import supabase from '@/lib/supabase';

// Upload a file to a specific bucket
export async function uploadFile(
  bucket: string,
  filePath: string,
  file: File
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (error) {
    throw new Error(`Error uploading file: ${error.message}`);
  }

  // Get the public URL
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

// Delete a file from a bucket
export async function deleteFile(bucket: string, filePath: string): Promise<void> {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([filePath]);

  if (error) {
    throw new Error(`Error deleting file: ${error.message}`);
  }
}

// List all files in a folder in a bucket
export async function listFiles(bucket: string, folderPath: string): Promise<string[]> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .list(folderPath);

  if (error) {
    throw new Error(`Error listing files: ${error.message}`);
  }

  return data.map(file => file.name);
}

// Create a signed URL (for temporary access)
export async function createSignedUrl(
  bucket: string,
  filePath: string,
  expiresIn: number = 60
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(filePath, expiresIn);

  if (error) {
    throw new Error(`Error creating signed URL: ${error.message}`);
  }

  return data.signedUrl;
}
