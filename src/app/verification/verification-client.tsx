"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge as UiBadge } from "@/components/ui/badge";
import { CheckCircle, XCircle, RefreshCw, HelpCircle, Lightbulb, Camera, UserCheck, UserSearch } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { verifyIdentity, VerifyIdentityOutput } from "@/ai/flows/verify-identity";
import { suggestIdentity, SuggestIdentityOutput } from "@/ai/flows/suggest-identity";

export function VerificationClient() {
  const { toast } = useToast();

  // State para o fluxo de Verificação
  const [verifyEmployeeId, setVerifyEmployeeId] = useState("102");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<VerifyIdentityOutput | null>(null);
  const [verifyImageSrc, setVerifyImageSrc] = useState<string | null>(null);

  // State para o fluxo de Sugestão
  const [suggestEmployeeId, setSuggestEmployeeId] = useState("512");
  const [suggestName, setSuggestName] = useState("Carlos Pereira");
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestResult, setSuggestResult] = useState<SuggestIdentityOutput | null>(null);
  const [suggestImageSrc, setSuggestImageSrc] = useState<string | null>(null);

  // State da Câmera
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isLive, setIsLive] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!isLive) return;
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
          title: 'Acesso à câmera negado',
          description: 'Por favor, habilite o acesso à câmera nas configurações do seu navegador.',
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
  }, [isLive, toast]);

  const captureImage = (setter: React.Dispatch<React.SetStateAction<string | null>>) => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/png');
        setter(dataUrl);
        setIsLive(false);
      }
    }
  };

  const retakeImage = (setter: React.Dispatch<React.SetStateAction<string | null>>) => {
    setter(null);
    setIsLive(true);
  }

  const handleVerify = async () => {
    if (!verifyEmployeeId) {
      toast({ variant: "destructive", title: "Matrícula do funcionário é obrigatória" });
      return;
    }
    if (!verifyImageSrc) {
      toast({ variant: "destructive", title: "Imagem é obrigatória", description: "Capture uma imagem para verificação." });
      return;
    }

    setIsVerifying(true);
    setVerifyResult(null);
    try {
      const result = await verifyIdentity({
        photoDataUri: verifyImageSrc,
        employeeId: verifyEmployeeId,
      });
      setVerifyResult(result);
    } catch (error) {
      toast({ variant: "destructive", title: "Falha na Verificação", description: "Ocorreu um erro ao chamar o serviço de IA." });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSuggest = async () => {
    if (!suggestImageSrc) {
      toast({ variant: "destructive", title: "Imagem é obrigatória", description: "Capture uma imagem para obter sugestões." });
      return;
    }

    setIsSuggesting(true);
    setSuggestResult(null);
    try {
      const result = await suggestIdentity({
        photoDataUri: suggestImageSrc,
        employeeId: suggestEmployeeId,
        name: suggestName,
      });
      setSuggestResult(result);
    } catch (error) {
      toast({ variant: "destructive", title: "Falha na Sugestão", description: "Ocorreu um erro ao chamar o serviço de IA." });
    } finally {
      setIsSuggesting(false);
    }
  };

  const renderCameraView = (imageSrc: string | null, onCapture: () => void, onRetake: () => void, disabled: boolean) => (
    <div className="space-y-4">
      <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
        {imageSrc ? (
          <Image src={imageSrc} alt="Foto capturada" layout="fill" objectFit="cover" data-ai-hint="person portrait" />
        ) : isLive ? (
          <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
        ) : null}

        {hasCameraPermission === false && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center p-4">
            <Alert variant="destructive">
              <AlertTitle>Acesso à Câmera Negado</AlertTitle>
              <AlertDescription>
                Por favor, habilite o acesso à câmera para usar esta funcionalidade.
              </AlertDescription>
            </Alert>
          </div>
        )}

        <div className="absolute top-2 right-2 flex items-center gap-2">
          <UiBadge variant="outline">{isLive && !imageSrc ? 'Ao Vivo' : 'Capturada'}</UiBadge>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden"></canvas>
      {imageSrc ? (
        <Button onClick={onRetake} className="w-full" variant="secondary" disabled={disabled}>
          <Camera className="mr-2 h-4 w-4" />
          Tirar Outra Foto
        </Button>
      ) : (
        <Button onClick={onCapture} className="w-full" variant="secondary" disabled={hasCameraPermission !== true || disabled}>
          <Camera className="mr-2 h-4 w-4" />
          Capturar para Verificar
        </Button>
      )}
    </div>
  );


  return (
    <>
      <Tabs defaultValue="verify" className="w-full" onValueChange={() => { setVerifyImageSrc(null); setSuggestImageSrc(null); setIsLive(true); }}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="verify"><UserCheck className="mr-2 h-4 w-4" />Verificar Identidade</TabsTrigger>
          <TabsTrigger value="suggest"><UserSearch className="mr-2 h-4 w-4" />Sugerir Identidade</TabsTrigger>
        </TabsList>

        <TabsContent value="verify">
          <Card>
            <CardHeader>
              <CardTitle>Verificação de Identidade</CardTitle>
              <CardDescription>Verifique a identidade de um funcionário em relação aos seus dados biométricos registrados.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              {renderCameraView(verifyImageSrc, () => captureImage(setVerifyImageSrc), () => retakeImage(setVerifyImageSrc), isVerifying)}

              <div className="flex flex-col space-y-4">
                <div>
                  <Label htmlFor="verify-employee-id">Matrícula</Label>
                  <Input id="verify-employee-id" value={verifyEmployeeId} onChange={(e) => setVerifyEmployeeId(e.target.value)} placeholder="Digite a matrícula para verificar" disabled={isVerifying} />
                </div>

                <div className="flex-grow space-y-4">
                  <Label>Resultado da Verificação</Label>
                  <div className="border rounded-lg p-4 min-h-[200px] bg-muted/50 flex items-center justify-center">
                    {isVerifying ? (
                      <div className="text-center text-muted-foreground">
                        <RefreshCw className="mx-auto h-8 w-8 animate-spin" />
                        <p className="mt-2">Verificando...</p>
                      </div>
                    ) : !verifyResult ? (
                      <div className="text-center text-muted-foreground">
                        <HelpCircle className="mx-auto h-8 w-8" />
                        <p className="mt-2">O resultado será mostrado aqui.</p>
                      </div>
                    ) : (
                      <div className="w-full">
                        {verifyResult.isVerified ? (
                          <Alert className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
                            <CheckCircle className="h-4 w-4 !text-green-600 dark:!text-green-400" />
                            <AlertTitle className="text-green-800 dark:text-green-300">Identidade Verificada</AlertTitle>
                            <AlertDescription className="text-green-700 dark:text-green-400">
                              O usuário foi autenticado com sucesso.
                            </AlertDescription>
                          </Alert>
                        ) : (
                          <Alert variant="destructive">
                            <XCircle className="h-4 w-4" />
                            <AlertTitle>Falha na Verificação</AlertTitle>
                            <AlertDescription>
                              O usuário não pôde ser autenticado.
                            </AlertDescription>
                          </Alert>
                        )}
                        <div className="mt-4 space-y-3">
                          <div className="text-sm">
                            <span className="font-medium">Confiança:</span>
                            <Progress value={verifyResult.confidence * 100} className="mt-1 h-2" />
                            <span className="text-xs text-muted-foreground float-right">{(verifyResult.confidence * 100).toFixed(0)}%</span>
                          </div>
                          {!verifyResult.isVerified && verifyResult.possibleAlternatives.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium mb-2">Alternativas Possíveis:</h4>
                              <ul className="list-disc list-inside text-sm text-muted-foreground bg-background p-3 rounded-md">
                                {verifyResult.possibleAlternatives.map(id => <li key={id}>Matrícula: {id}</li>)}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleVerify} disabled={isVerifying || !verifyImageSrc} className="w-full bg-accent hover:bg-accent/90">
                {isVerifying && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                Verificar Identidade
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="suggest">
          <Card>
            <CardHeader>
              <CardTitle>Sugerir Possíveis Identidades</CardTitle>
              <CardDescription>Se uma pessoa for desconhecida, esta ferramenta pode sugerir correspondências do banco de dados.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              {renderCameraView(suggestImageSrc, () => captureImage(setSuggestImageSrc), () => retakeImage(setSuggestImageSrc), isSuggesting)}

              <div className="flex flex-col space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="suggest-name">Nome Conhecido (Opcional)</Label>
                    <Input id="suggest-name" value={suggestName} onChange={(e) => setSuggestName(e.target.value)} placeholder="ex: Carlos P." disabled={isSuggesting} />
                  </div>
                  <div>
                    <Label htmlFor="suggest-employee-id">Matrícula (Opcional)</Label>
                    <Input id="suggest-employee-id" value={suggestEmployeeId} onChange={(e) => setSuggestEmployeeId(e.target.value)} placeholder="ex: 512" disabled={isSuggesting} />
                  </div>
                </div>
                <div className="flex-grow space-y-4">
                  <Label>Identidades Sugeridas</Label>
                  <div className="border rounded-lg p-4 min-h-[200px] bg-muted/50 flex items-center justify-center">
                    {isSuggesting ? (
                      <div className="text-center text-muted-foreground">
                        <RefreshCw className="mx-auto h-8 w-8 animate-spin" />
                        <p className="mt-2">Analisando...</p>
                      </div>
                    ) : !suggestResult || suggestResult.possibleIdentities.length === 0 ? (
                      <div className="text-center text-muted-foreground">
                        <HelpCircle className="mx-auto h-8 w-8" />
                        <p className="mt-2">{suggestResult ? "Nenhuma correspondência encontrada." : "As sugestões aparecerão aqui."}</p>
                      </div>
                    ) : (
                      <div className="w-full space-y-2">
                        {suggestResult.possibleIdentities.map((p, i) => (
                          <div key={i} className="bg-background p-3 rounded-md border">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-semibold">{p.name}</p>
                                <p className="text-sm text-muted-foreground">Matrícula: {p.employeeId}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground">Confiança</p>
                                <p className="font-semibold text-lg text-accent">{(p.confidence * 100).toFixed(0)}%</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSuggest} disabled={isSuggesting || !suggestImageSrc} className="w-full bg-accent hover:bg-accent/90">
                {isSuggesting && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                Obter Sugestões
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
