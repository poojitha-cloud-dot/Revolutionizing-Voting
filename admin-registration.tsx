import { useState, useRef } from "react";
import { useVoterStore } from "@/stores/voterStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Upload, CheckCircle, Loader2, Scan, FileText, UserPlus, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { extractTextFromImage, parseVoterIDText, detectFaceAndDescriptor } from "@/lib/biometrics";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AdminRegistration() {
  const { addVoter } = useVoterStore();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [faceData, setFaceData] = useState<Float32Array | undefined>(undefined);
  const [processingStep, setProcessingStep] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
      processVoterId(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const processVoterId = async (imageUrl: string) => {
    setIsProcessing(true);
    setExtractedData(null);
    setFaceData(undefined);
    setError(null);
    
    try {
      // 1. OCR Processing
      setProcessingStep("Extracting text from ID...");
      const text = await extractTextFromImage(imageUrl);
      const data = parseVoterIDText(text);
      
      // 2. Face Detection
      setProcessingStep("Detecting face biometrics...");
      
      // Create an image element for face-api
      const img = new Image();
      img.src = imageUrl;
      await new Promise((resolve) => { img.onload = resolve; });
      
      const detection = await detectFaceAndDescriptor(img);
      
      if (!detection) {
        throw new Error("No face detected in the ID card. Please upload a clearer image.");
      }
      
      setFaceData(detection.descriptor);
      
      // Combine data
      const finalData = {
        ...data,
        photoUrl: imageUrl, // In a real app we'd crop the face here
        registrationDate: new Date().toISOString().split('T')[0],
        hasVoted: false,
        faceDescriptor: detection.descriptor
      };
      
      setExtractedData(finalData);
      toast({
        title: "Voter ID Processed Successfully",
        description: "Text and biometric data extracted.",
      });
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to process ID card.");
      toast({
        title: "Processing Failed",
        description: err.message || "Could not extract information.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setProcessingStep("");
    }
  };

  const handleRegister = () => {
    if (!extractedData) return;
    
    addVoter(extractedData);
    
    toast({
      title: "Voter Registered",
      description: `Voter ${extractedData.name} (${extractedData.id}) has been added to the system.`,
      variant: "default",
    });

    // Reset form
    setExtractedData(null);
    setPreviewImage(null);
    setFaceData(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Voter Registration</h2>
        <p className="text-muted-foreground">
          Upload Voter ID card to extract information and register the voter in the central database.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <Card className="border-dashed border-2 border-border shadow-none bg-muted/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scan className="w-5 h-5 text-primary" />
              Upload Voter ID
            </CardTitle>
            <CardDescription>
              Supported formats: JPG, PNG. Max size: 5MB.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center min-h-[300px] gap-4">
            {previewImage ? (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border shadow-sm bg-black/5">
                <img src={previewImage} alt="Voter ID" className="w-full h-full object-contain" />
                {isProcessing && (
                  <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="font-medium animate-pulse">{processingStep}</p>
                  </div>
                )}
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setPreviewImage(null);
                    setExtractedData(null);
                    setError(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  disabled={isProcessing}
                >
                  Clear
                </Button>
              </div>
            ) : (
              <div 
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="p-4 rounded-full bg-primary/10 text-primary mb-4">
                  <Upload className="w-8 h-8" />
                </div>
                <p className="font-medium">Click to upload or drag and drop</p>
                <p className="text-sm text-muted-foreground mt-1">Scan front side of ID card</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileUpload}
                />
              </div>
            )}
            
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Extraction Form */}
        <Card className={`transition-all duration-500 ${extractedData ? 'opacity-100 translate-x-0' : 'opacity-50 translate-x-4 grayscale'}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Extracted Information
            </CardTitle>
            <CardDescription>
              Review the extracted data before saving to the database.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Voter ID Number</Label>
                <Input value={extractedData?.id || "Waiting for scan..."} readOnly className="font-mono bg-muted/50" />
              </div>
              <div className="space-y-2">
                <Label>Registration Date</Label>
                <Input value={extractedData?.registrationDate || ""} readOnly className="bg-muted/50" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={extractedData?.name || ""} readOnly className="bg-muted/50" />
            </div>

            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Input value={extractedData?.dob || ""} readOnly className="bg-muted/50" />
            </div>

            <div className="space-y-2">
              <Label>Address</Label>
              <Input value={extractedData?.address || ""} readOnly className="bg-muted/50" />
            </div>

            {faceData && (
              <div className="pt-4 flex items-center gap-4 bg-green-50 p-4 rounded-lg border border-green-100 dark:bg-green-900/20 dark:border-green-900">
                <div className="relative">
                   <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary bg-muted">
                      <img src={extractedData?.photoUrl} className="w-full h-full object-cover" />
                   </div>
                   <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1 border-2 border-white">
                      <CheckCircle className="w-3 h-3" />
                   </div>
                </div>
                <div className="text-sm">
                   <p className="font-medium text-green-700 dark:text-green-300">Biometric Template Created</p>
                   <p className="text-muted-foreground text-xs">Face descriptor generated & ready for storage</p>
                </div>
              </div>
            )}

            <Button 
              className="w-full mt-6" 
              size="lg" 
              disabled={!extractedData || !faceData}
              onClick={handleRegister}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Register Voter
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
