"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge as UiBadge, CheckCircle, XCircle, RefreshCw, HelpCircle, User, Lightbulb, Camera, ChevronRight, UserCheck, UserSearch } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { verifyIdentity, VerifyIdentityOutput } from "@/ai/flows/verify-identity";
import { suggestIdentity, SuggestIdentityOutput } from "@/ai/flows/suggest-identity";

// A placeholder base64 SVG for the photo to avoid network requests
const PLACEHOLDER_PHOTO_DATA_URI = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2EwYTBiMiIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTE4IDIwYTYgNiAwIDAgMC0xMiAwIi8+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMCIgcj0iNCIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjEwIi8+PC9zdmc+";

export function VerificationClient() {
  const { toast } = useToast();
  
  // State for Verification Flow
  const [verifyEmployeeId, setVerifyEmployeeId] = useState("102");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<VerifyIdentityOutput | null>(null);

  // State for Suggestion Flow
  const [suggestEmployeeId, setSuggestEmployeeId] = useState("512");
  const [suggestName, setSuggestName] = useState("Carlos Pereira");
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestResult, setSuggestResult] = useState<SuggestIdentityOutput | null>(null);

  const handleVerify = async () => {
    if (!verifyEmployeeId) {
      toast({ variant: "destructive", title: "Employee ID required" });
      return;
    }
    setIsVerifying(true);
    setVerifyResult(null);
    try {
      const result = await verifyIdentity({
        photoDataUri: PLACEHOLDER_PHOTO_DATA_URI,
        employeeId: verifyEmployeeId,
      });
      setVerifyResult(result);
    } catch (error) {
      toast({ variant: "destructive", title: "Verification Failed", description: "An error occurred while calling the AI service." });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSuggest = async () => {
    if (!suggestEmployeeId || !suggestName) {
      toast({ variant: "destructive", title: "Employee ID and Name required" });
      return;
    }
    setIsSuggesting(true);
    setSuggestResult(null);
    try {
      const result = await suggestIdentity({
        photoDataUri: PLACEHOLDER_PHOTO_DATA_URI,
        employeeId: suggestEmployeeId,
        name: suggestName,
      });
      setSuggestResult(result);
    } catch (error) {
      toast({ variant: "destructive", title: "Suggestion Failed", description: "An error occurred while calling the AI service." });
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <Tabs defaultValue="verify" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="verify"><UserCheck className="mr-2 h-4 w-4"/>Verify Identity</TabsTrigger>
        <TabsTrigger value="suggest"><UserSearch className="mr-2 h-4 w-4"/>Suggest Identity</TabsTrigger>
      </TabsList>
      
      <TabsContent value="verify">
        <Card>
          <CardHeader>
            <CardTitle>Identity Verification</CardTitle>
            <CardDescription>Verify an employee's identity against their registered biometric data.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
               <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                <Image src={PLACEHOLDER_PHOTO_DATA_URI} alt="Verification photo" layout="fill" objectFit="contain" className="p-8" data-ai-hint="person avatar" />
                 <div className="absolute top-2 right-2 flex items-center gap-2">
                  <UiBadge variant="outline">Live Feed</UiBadge>
                  <Button size="icon" variant="secondary" className="h-8 w-8"><Camera className="h-4 w-4"/></Button>
                 </div>
              </div>
              <div>
                <Label htmlFor="verify-employee-id">Employee ID</Label>
                <Input id="verify-employee-id" value={verifyEmployeeId} onChange={(e) => setVerifyEmployeeId(e.target.value)} placeholder="Enter Employee ID to verify against" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex-grow space-y-4">
                <Label>Verification Result</Label>
                <div className="border rounded-lg p-4 min-h-[200px] bg-muted/50 flex items-center justify-center">
                  {isVerifying ? (
                    <div className="text-center text-muted-foreground">
                      <RefreshCw className="mx-auto h-8 w-8 animate-spin" />
                      <p className="mt-2">Verifying...</p>
                    </div>
                  ) : !verifyResult ? (
                    <div className="text-center text-muted-foreground">
                      <HelpCircle className="mx-auto h-8 w-8" />
                      <p className="mt-2">Result will be shown here.</p>
                    </div>
                  ) : (
                    <div className="w-full">
                      {verifyResult.isVerified ? (
                        <Alert className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
                          <CheckCircle className="h-4 w-4 !text-green-600 dark:!text-green-400" />
                          <AlertTitle className="text-green-800 dark:text-green-300">Identity Verified</AlertTitle>
                          <AlertDescription className="text-green-700 dark:text-green-400">
                            The user has been successfully authenticated.
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <Alert variant="destructive">
                          <XCircle className="h-4 w-4" />
                          <AlertTitle>Verification Failed</AlertTitle>
                          <AlertDescription>
                            The user could not be authenticated.
                          </AlertDescription>
                        </Alert>
                      )}
                      <div className="mt-4 space-y-3">
                          <div className="text-sm">
                              <span className="font-medium">Confidence:</span>
                              <Progress value={verifyResult.confidence * 100} className="mt-1 h-2" />
                              <span className="text-xs text-muted-foreground float-right">{ (verifyResult.confidence * 100).toFixed(0) }%</span>
                          </div>
                          {!verifyResult.isVerified && verifyResult.possibleAlternatives.length > 0 && (
                            <div>
                                <h4 className="text-sm font-medium mb-2">Possible Alternatives:</h4>
                                <ul className="list-disc list-inside text-sm text-muted-foreground bg-background p-3 rounded-md">
                                    {verifyResult.possibleAlternatives.map(id => <li key={id}>Employee ID: {id}</li>)}
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
            <Button onClick={handleVerify} disabled={isVerifying} className="w-full bg-accent hover:bg-accent/90">
              {isVerifying && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
              Verify Identity
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="suggest">
         <Card>
          <CardHeader>
            <CardTitle>Suggest Possible Identities</CardTitle>
            <CardDescription>If a person is unknown, this tool can suggest potential matches from the user database.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
             <div className="space-y-4">
               <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                <Image src={PLACEHOLDER_PHOTO_DATA_URI} alt="Suggestion photo" layout="fill" objectFit="contain" className="p-8" data-ai-hint="person avatar"/>
                <div className="absolute top-2 right-2 flex items-center gap-2">
                  <UiBadge variant="outline">Snapshot</UiBadge>
                   <Button size="icon" variant="secondary" className="h-8 w-8"><Camera className="h-4 w-4"/></Button>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="suggest-name">Known Name (Optional)</Label>
                  <Input id="suggest-name" value={suggestName} onChange={(e) => setSuggestName(e.target.value)} placeholder="e.g. Carlos P."/>
                </div>
                 <div>
                  <Label htmlFor="suggest-employee-id">Known ID (Optional)</Label>
                  <Input id="suggest-employee-id" value={suggestEmployeeId} onChange={(e) => setSuggestEmployeeId(e.target.value)} placeholder="e.g. 512"/>
                </div>
              </div>
            </div>
             <div className="flex flex-col">
              <div className="flex-grow space-y-4">
                <Label>Suggested Identities</Label>
                <div className="border rounded-lg p-4 min-h-[200px] bg-muted/50 flex items-center justify-center">
                   {isSuggesting ? (
                    <div className="text-center text-muted-foreground">
                      <RefreshCw className="mx-auto h-8 w-8 animate-spin" />
                      <p className="mt-2">Analyzing...</p>
                    </div>
                  ) : !suggestResult || suggestResult.possibleIdentities.length === 0 ? (
                    <div className="text-center text-muted-foreground">
                      <HelpCircle className="mx-auto h-8 w-8" />
                      <p className="mt-2">{suggestResult ? "No matches found." : "Suggestions will appear here."}</p>
                    </div>
                  ) : (
                    <div className="w-full space-y-2">
                        {suggestResult.possibleIdentities.map((p, i) => (
                           <div key={i} className="bg-background p-3 rounded-md border">
                               <div className="flex justify-between items-center">
                                   <div>
                                       <p className="font-semibold">{p.name}</p>
                                       <p className="text-sm text-muted-foreground">Employee ID: {p.employeeId}</p>
                                   </div>
                                   <div className="text-right">
                                        <p className="text-xs text-muted-foreground">Confidence</p>
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
            <Button onClick={handleSuggest} disabled={isSuggesting} className="w-full bg-accent hover:bg-accent/90">
              {isSuggesting && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
              Get Suggestions
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
