'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RefreshCw, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function SettingsForm() {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        // Simulate saving to a backend
        setTimeout(() => {
            setIsLoading(false);
            toast({
                title: "Configuration Saved",
                description: "Your API settings have been successfully updated.",
            });
        }, 1500);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>UNISYSTEM Integration</CardTitle>
                        <CardDescription>Configure the API connection for UNISYSTEM ERP.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="unisystem-api-url">API Endpoint URL</Label>
                            <Input id="unisystem-api-url" defaultValue="https://api.unisystem.com/v2/" placeholder="https://api.unisystem.com/v2/" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="unisystem-api-key">API Key</Label>
                            <Input id="unisystem-api-key" type="password" defaultValue="************" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>TOTVS RM Integration</CardTitle>
                        <CardDescription>Configure the API connection for TOTVS RM.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="totvs-api-url">API Endpoint URL</Label>
                            <Input id="totvs-api-url" defaultValue="https://api.totvs.com.br/rm/v1/" placeholder="https://api.totvs.com.br/rm/v1/" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="totvs-client-id">Client ID</Label>
                            <Input id="totvs-client-id" defaultValue="CLIENT_ID_XYZ" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="totvs-client-secret">Client Secret</Label>
                            <Input id="totvs-client-secret" type="password" defaultValue="************" />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading} className="bg-accent hover:bg-accent/90">
                        {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Configuration
                    </Button>
                </div>
            </div>
        </form>
    );
}
