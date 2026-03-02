import { useState, useRef } from 'react';
import { useUploadResume } from '../hooks/useQueries';
import type { Candidate } from '../backend';
import { ExternalBlob } from '../backend';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle, Loader2, File } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  candidate: Candidate;
}

export default function ResumeUploadSection({ candidate }: Props) {
  const uploadResume = useUploadResume();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const hasResume = !!candidate.resumeFile;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF or DOC/DOCX file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setSelectedFileName(file.name);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
        setUploadProgress(pct);
      });

      await uploadResume.mutateAsync({ candidateId: candidate.id, file: blob });
      toast.success('Resume uploaded successfully!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to upload resume');
      setSelectedFileName(null);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="shadow-card border-border">
      <CardContent className="p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" /> Resume Management
        </h3>

        {hasResume && (
          <div className="flex items-center gap-3 p-4 bg-secondary rounded-lg mb-4 border border-border">
            <CheckCircle className="w-5 h-5 text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">Resume Uploaded</p>
              <p className="text-xs text-muted-foreground truncate">
                {selectedFileName || 'Resume on file'}
              </p>
            </div>
            <Badge variant="secondary" className="text-primary text-xs">Active</Badge>
          </div>
        )}

        {isUploading && (
          <div className="mb-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Uploading {selectedFileName}...</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-xs text-muted-foreground">{uploadProgress}% complete</p>
          </div>
        )}

        <div
          className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-secondary/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium text-foreground mb-1">
            {hasResume ? 'Replace Resume' : 'Upload Resume'}
          </p>
          <p className="text-sm text-muted-foreground mb-3">
            Drag & drop or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            Supported formats: PDF, DOC, DOCX (max 10MB)
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
        />

        <Button
          variant="outline"
          className="mt-4 w-full border-primary text-primary hover:bg-secondary"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</>
          ) : (
            <><File className="w-4 h-4 mr-2" /> {hasResume ? 'Replace Resume' : 'Choose File'}</>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
