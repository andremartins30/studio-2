"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, User, Badge, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function EnrollmentForm() {
  const [employeeName, setEmployeeName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCapture = () => {
    setIsCapturing(true);
    setTimeout(() => {
      // Simulate camera capture
      const timestamp = new Date().getTime();
      setImageSrc(`https://placehold.co/400x400.png?t=${timestamp}`);
      setIsCapturing(false);
    }, 1000);
  };

  const handleRegister = () => {
    if (!employeeName || !employeeId || !imageSrc) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide name, ID, and capture an image.",
      });
      return;
    }
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "User Registered",
        description: `Employee ${employeeName} (ID: ${employeeId}) has been successfully enrolled.`,
      });
      // Reset form
      setEmployeeName("");
      setEmployeeId("");
      setImageSrc(null);
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>New User Registration</CardTitle>
        <CardDescription>Fill in the details below to enroll a new user.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="employee-name">Employee Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="employee-name" placeholder="e.g., Maria Souza" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} className="pl-10" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="employee-id">Employee ID</Label>
          <div className="relative">
            <Badge className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="employee-id" placeholder="e.g., 301" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className="pl-10" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Biometric Capture</Label>
          <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
            {imageSrc ? (
              <Image src={imageSrc} alt="Captured image" layout="fill" objectFit="cover" data-ai-hint="person portrait" />
            ) : (
              <div className="text-center text-muted-foreground">
                <Camera className="mx-auto h-12 w-12" />
                <p>Image preview will appear here</p>
              </div>
            )}
            {isCapturing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <RefreshCw className="h-8 w-8 text-white animate-spin" />
                </div>
            )}
          </div>
          <Button onClick={handleCapture} disabled={isCapturing} className="w-full" variant="secondary">
            <Camera className="mr-2 h-4 w-4" />
            {isCapturing ? "Capturing..." : imageSrc ? "Retake Photo" : "Capture Photo"}
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleRegister} disabled={isLoading} className="w-full bg-accent hover:bg-accent/90">
            {isLoading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
            Register User
        </Button>
      </CardFooter>
    </Card>
  );
}
