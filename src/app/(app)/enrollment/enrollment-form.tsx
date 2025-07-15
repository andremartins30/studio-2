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
      // Simula captura da câmera
      const timestamp = new Date().getTime();
      setImageSrc(`https://placehold.co/400x400.png?t=${timestamp}`);
      setIsCapturing(false);
    }, 1000);
  };

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
            <Badge className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="employee-id" placeholder="ex: 301" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className="pl-10" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Captura Biométrica</Label>
          <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
            {imageSrc ? (
              <Image src={imageSrc} alt="Imagem capturada" layout="fill" objectFit="cover" data-ai-hint="person portrait" />
            ) : (
              <div className="text-center text-muted-foreground">
                <Camera className="mx-auto h-12 w-12" />
                <p>A prévia da imagem aparecerá aqui</p>
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
            {isCapturing ? "Capturando..." : imageSrc ? "Tirar Outra Foto" : "Capturar Foto"}
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleRegister} disabled={isLoading} className="w-full bg-accent hover:bg-accent/90">
            {isLoading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
            Cadastrar Usuário
        </Button>
      </CardFooter>
    </Card>
  );
}
