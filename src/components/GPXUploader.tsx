'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import { parseGPX } from '@/utils/gpxParser';
import type { GPXData } from '@/utils/gpxParser';

interface GPXUploaderProps {
  onGPXLoaded: (data: GPXData) => void;
  isLoading: boolean;
}

export default function GPXUploader({ onGPXLoaded, isLoading }: GPXUploaderProps) {
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setFileName(file.name);
    setError(null);
    
    // Check if file is GPX
    if (!file.name.toLowerCase().endsWith('.gpx')) {
      setError('Please select a GPX file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const gpxData = parseGPX(event.target?.result as string);
        onGPXLoaded(gpxData);
      } catch (err) {
        console.error('Error parsing GPX:', err);
        setError('Invalid GPX file or format not supported');
      }
    };
    
    reader.readAsText(file);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Upload GPX File</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="fileInput" className="text-sm">
              Select GPX file
            </Label>
            <div className="flex gap-2">
              <Input
                id="fileInput"
                type="file"
                accept=".gpx"
                onChange={handleFileChange}
                className="cursor-pointer file:bg-primary file:text-primary-foreground file:border-none file:rounded file:px-2.5 file:py-1.5 file:font-medium hover:file:bg-primary/90"
              />
              <Button 
                disabled={isLoading || !fileName}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
            </div>
            {fileName && !error && (
              <p className="text-xs text-secondary mt-1">
                {fileName} selected
              </p>
            )}
            {error && (
              <p className="text-xs text-destructive mt-1">
                {error}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 