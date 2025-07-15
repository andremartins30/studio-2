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
        // Simula o salvamento em um backend
        setTimeout(() => {
            setIsLoading(false);
            toast({
                title: "Configuração Salva",
                description: "Suas configurações de API foram atualizadas com sucesso.",
            });
        }, 1500);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Integração UNISYSTEM</CardTitle>
                        <CardDescription>Configure a conexão da API para o ERP UNISYSTEM.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="unisystem-api-url">URL do Endpoint da API</Label>
                            <Input id="unisystem-api-url" defaultValue="https://api.unisystem.com/v2/" placeholder="https://api.unisystem.com/v2/" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="unisystem-api-key">Chave da API</Label>
                            <Input id="unisystem-api-key" type="password" defaultValue="************" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Integração TOTVS RM</CardTitle>
                        <CardDescription>Configure a conexão da API para o TOTVS RM.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="totvs-api-url">URL do Endpoint da API</Label>
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
                        Salvar Configuração
                    </Button>
                </div>
            </div>
        </form>
    );
}
