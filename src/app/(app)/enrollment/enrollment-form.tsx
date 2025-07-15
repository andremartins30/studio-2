"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Camera, User, Badge as BadgeIcon, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function EnrollmentForm() {
  const [employeeName, setEmployeeName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    getCameraPermission();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    }
  }, [toast]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/png');
        setImageSrc(dataUrl);
      }
    }
  };

  const handleRetake = () => {
    setImageSrc(null);
  }

  const handleRegister = () => {
    if (!employeeName || !employeeId || !imageSrc) {
      toast({
        variant: "destructive",
        title: "Informações Faltando",
        description: "Por favor, forneça nome, matrícula e capture uma imagem.",
      });
      return;
    }
    setIsLoading(true);
    // Simula chamada de API
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Usuário Registrado",
        description: `Funcionário ${employeeName} (Matrícula: ${employeeId}) foi cadastrado com sucesso.`,
      });
      // Reseta o formulário
      setEmployeeName("");
      setEmployeeId("");
      setImageSrc(null);
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cadastro de Novo Usuário</CardTitle>
        <CardDescription>Preencha os detalhes abaixo para cadastrar um novo usuário.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="employee-name">Nome do Funcionário</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="employee-name" placeholder="ex: Maria Souza" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} className="pl-10" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="employee-id">Matrícula</Label>
          <div className="relative">
            <BadgeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="employee-id" placeholder="ex: 301" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className="pl-10" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Captura Biométrica</Label>
          <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
            {imageSrc ? (
              <Image src={imageSrc} alt="Imagem capturada" layout="fill" objectFit="cover" data-ai-hint="person portrait" />
            ) : (
               <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
            )}
             {hasCameraPermission === false && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center p-4">
                     <Alert variant="destructive">
                      <AlertTitle>Acesso à Câmera Negado</AlertTitle>
                      <AlertDescription>
                        Por favor, habilite o acesso à câmera nas configurações do seu navegador para continuar.
                      </AlertDescription>
                    </Alert>
                </div>
            )}
          </div>
            <canvas ref={canvasRef} className="hidden"></canvas>
            {imageSrc ? (
                 <Button onClick={handleRetake} className="w-full" variant="secondary">
                    <Camera className="mr-2 h-4 w-4" />
                    Tirar Outra Foto
                </Button>
            ) : (
                <Button onClick={handleCapture} disabled={hasCameraPermission !== true} className="w-full" variant="secondary">
                    <Camera className="mr-2 h-4 w-4" />
                    Capturar Foto
                </Button>
            )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleRegister} disabled={isLoading || !imageSrc} className="w-full bg-accent hover:bg-accent/90">
            {isLoading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
            Cadastrar Usuário
        </Button>
      </CardFooter>
    </Card>
  );
}
