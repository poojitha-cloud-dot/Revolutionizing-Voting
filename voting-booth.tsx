import { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { QRCodeSVG } from "qrcode.react";
import { useVoterStore, type Voter } from "@/stores/voterStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Camera, Search, UserCheck, RefreshCw, QrCode, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { detectFaceAndDescriptor, compareFaces, loadModels } from "@/lib/biometrics";

export default function VotingBooth() {
  const { getVoter, markVoted } = useVoterStore();
  const { toast } = useToast();
  
  const [step, setStep] = useState<"search" | "verify" | "result">("search");
  const [voterId, setVoterId] = useState("");
  const [currentVoter, setCurrentVoter] = useState<Voter | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "scanning" | "success" | "failed">("idle");
  const [matchScore, setMatchScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [modelsReady, setModelsReady] = useState(false);
  
  const webcamRef = useRef<Webcam>(null);

  useEffect(() => {
    // Preload models when entering booth
    loadModels().then(() => setModelsReady(true));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const voter = getVoter(voterId);
    
    if (!voter) {
      toast({
        title: "Voter Not Found",
        description: "Please check the ID number and try again.",
        variant: "destructive"
      });
      return;
    }

    if (voter.hasVoted) {
      toast({
        title: "Already Voted",
        description: "This voter ID has already been used to vote.",
        variant: "destructive"
      });
      return;
    }

    setCurrentVoter(voter);
    setStep("verify");
    setVerificationStatus("idle");
    setMatchScore(0);
  };

  const captureAndVerify = useCallback(async () => {
    if (!webcamRef.current || !currentVoter?.faceDescriptor) return;
    
    setVerificationStatus("scanning");
    
    try {
      // Capture frame
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) throw new Error("Failed to capture image");
      
      const img = new Image();
      img.src = imageSrc;
      await new Promise((resolve) => { img.onload = resolve; });
      
      // Detect face
      const detection = await detectFaceAndDescriptor(img);
      
      if (!detection) {
        setVerificationStatus("failed");
        setMatchScore(0);
        toast({
          title: "No Face Detected",
          description: "Please look directly at the camera and try again.",
          variant: "destructive"
        });
        return;
      }
      
      // Compare
      const result = compareFaces(detection.descriptor, currentVoter.faceDescriptor);
      
      setMatchScore(result.score);
      setDistance(result.distance);
      
      if (result.isMatch) {
        setVerificationStatus("success");
        markVoted(currentVoter.id);
        setTimeout(() => setStep("result"), 1500);
      } else {
        setVerificationStatus("failed");
        toast({
          title: "Verification Failed",
          description: "Face does not match the stored ID photo.",
          variant: "destructive"
        });
      }
      
    } catch (error) {
      console.error(error);
      setVerificationStatus("failed");
      toast({
        title: "System Error",
        description: "Biometric verification failed.",
        variant: "destructive"
      });
    }

  }, [currentVoter, markVoted]);

  const resetProcess = () => {
    setStep("search");
    setVoterId("");
    setCurrentVoter(null);
    setVerificationStatus("idle");
    setMatchScore(0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Voting Booth Verification</h2>
        <p className="text-muted-foreground">Live identity verification for secure voting access.</p>
        {!modelsReady && (
          <p className="text-xs text-amber-500 animate-pulse">Loading biometric models...</p>
        )}
      </div>

      {step === "search" && (
        <Card className="max-w-md mx-auto shadow-lg">
          <CardHeader>
            <CardTitle>Enter Voter ID</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="voterId">Voter ID Number</Label>
                <div className="flex gap-2">
                  <Input 
                    id="voterId" 
                    placeholder="e.g. VOT-123456" 
                    value={voterId}
                    onChange={(e) => setVoterId(e.target.value)}
                    className="text-lg font-mono uppercase"
                  />
                  <Button type="submit" size="icon">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground bg-muted p-2 rounded">
                Note: Use the ID generated in the Registration tab.
              </p>
            </form>
          </CardContent>
        </Card>
      )}

      {step === "verify" && currentVoter && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Stored Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-primary" />
                Stored Record
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="aspect-square w-48 mx-auto rounded-lg overflow-hidden border-2 border-muted shadow-inner bg-muted">
                <img src={currentVoter.photoUrl} alt="Stored ID" className="w-full h-full object-contain" />
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium text-right">{currentVoter.name}</span>
                  
                  <span className="text-muted-foreground">ID Number:</span>
                  <span className="font-medium text-right font-mono">{currentVoter.id}</span>
                  
                  <span className="text-muted-foreground">DOB:</span>
                  <span className="font-medium text-right">{currentVoter.dob}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Live Cam */}
          <Card className={verificationStatus === "failed" ? "border-red-500 shadow-red-100" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary" />
                Live Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex flex-col items-center">
              <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full h-full object-cover"
                  mirrored
                  videoConstraints={{ facingMode: "user" }}
                />
                
                {/* Face Overlay */}
                <div className="absolute inset-0 border-2 border-primary/30 rounded-lg pointer-events-none">
                  <div className="absolute inset-[15%] border-2 border-dashed border-white/50 rounded-full animate-pulse"></div>
                </div>

                {/* Status Overlay */}
                {verificationStatus === "scanning" && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white backdrop-blur-sm">
                    <RefreshCw className="w-10 h-10 animate-spin mb-2" />
                    <p className="font-mono text-lg">Comparing Biometrics...</p>
                  </div>
                )}
              </div>

              {verificationStatus === "idle" && (
                <Button size="lg" className="w-full" onClick={captureAndVerify} disabled={!modelsReady}>
                  {modelsReady ? "Capture & Verify" : "Loading Models..."}
                </Button>
              )}

              {(verificationStatus === "scanning" || verificationStatus === "success" || verificationStatus === "failed") && (
                 <div className="w-full space-y-2">
                   <div className="flex justify-between text-xs uppercase font-bold text-muted-foreground">
                      <span>Match Confidence</span>
                      <span>{matchScore}%</span>
                   </div>
                   <Progress 
                    value={matchScore} 
                    className={`h-2 ${verificationStatus === "failed" ? "bg-red-100" : ""}`} 
                   />
                   {verificationStatus === "failed" && (
                     <p className="text-xs text-red-500 text-center font-mono">Distance: {distance.toFixed(4)} (Threshold: 0.6)</p>
                   )}
                 </div>
              )}

              {verificationStatus === "failed" && (
                <div className="w-full">
                  <Alert variant="destructive" className="mb-4">
                    <ShieldAlert className="h-4 w-4" />
                    <AlertTitle>Verification Failed</AlertTitle>
                    <AlertDescription>
                      Biometric match score too low. Identity cannot be confirmed.
                    </AlertDescription>
                  </Alert>
                  <Button variant="outline" className="w-full" onClick={() => setVerificationStatus("idle")}>
                    Retry
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {step === "result" && currentVoter && (
        <Card className="max-w-md mx-auto border-green-500 shadow-green-100 shadow-xl">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl text-green-700">Access Granted</CardTitle>
            <CardDescription>Identity verified successfully.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6 pt-6">
            <div className="bg-white p-4 rounded-xl shadow-inner border border-border">
              <QRCodeSVG 
                value={JSON.stringify({
                  id: currentVoter.id,
                  token: "SECURE-" + Math.random().toString(36).substr(2, 9),
                  timestamp: Date.now()
                })}
                size={200}
                level="H"
                includeMargin
              />
            </div>
            
            <div className="text-center space-y-1">
              <h3 className="font-bold text-lg">{currentVoter.name}</h3>
              <p className="font-mono text-muted-foreground">{currentVoter.id}</p>
              <div className="flex items-center justify-center gap-2 text-green-600 font-bold text-sm pt-2">
                 <UserCheck className="w-4 h-4" />
                 Match Score: {matchScore}%
              </div>
              <p className="text-xs text-muted-foreground pt-2">Scan this QR code at the voting machine.</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={resetProcess}>
              Process Next Voter
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
