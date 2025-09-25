import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Brain, User, Smile, Frown, Meh, ShieldCheck, FileText } from "lucide-react";

const accountSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Invalid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    role: z.enum(["patient", "psychologist"]),
});

const assessmentSchema = z.object({
    mood: z.number().min(0).max(10),
    primaryConcern: z.string().min(1, "Please select a primary concern."),
});

const consentSchema = z.object({
    consent: z.boolean().refine(val => val === true, {
        message: "You must consent to the terms to continue.",
    }),
});

type AccountValues = z.infer<typeof accountSchema>;
type AssessmentValues = z.infer<typeof assessmentSchema>;
type ConsentValues = z.infer<typeof consentSchema>;

const OnboardingPage: React.FC = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const accountForm = useForm<AccountValues>({ resolver: zodResolver(accountSchema), defaultValues: { role: 'patient' } });
    const assessmentForm = useForm<AssessmentValues>({ resolver: zodResolver(assessmentSchema), defaultValues: { mood: 5 } });
    const consentForm = useForm<ConsentValues>({ resolver: zodResolver(consentSchema) });

    const totalSteps = 3;
    const progress = (step / totalSteps) * 100;

    const handleNext = (data: any) => {
        setFormData(prev => ({ ...prev, ...data }));
        setStep(prev => prev + 1);
    };

    const handleBack = () => {
        setStep(prev => prev - 1);
    };

    const onAccountSubmit: SubmitHandler<AccountValues> = (data) => handleNext(data);
    const onAssessmentSubmit: SubmitHandler<AssessmentValues> = (data) => handleNext(data);
    const onConsentSubmit: SubmitHandler<ConsentValues> = async (data) => {
        setLoading(true);
        const finalData = { ...formData, ...data } as AccountValues & AssessmentValues & ConsentValues;

        const result = await signup({
            name: finalData.name,
            email: finalData.email,
            password: finalData.password,
            role: finalData.role,
        });

        setLoading(false);

        if (result.success) {
            toast.success(result.pendingEmailConfirmation ? result.message : "Account created successfully! Please log in.");
            // Here you could also save the initial assessment data to the user's profile
            navigate("/login");
        } else {
            toast.error(result.error || "An unknown error occurred.");
            setStep(1); // Go back to the first step on error
        }
    };

    const pageVariants = {
        initial: { opacity: 0, x: 50 },
        in: { opacity: 1, x: 0 },
        out: { opacity: 0, x: -50 },
    };

    const pageTransition = {
        type: "tween",
        ease: "anticipate",
        duration: 0.5,
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Brain className="w-8 h-8 text-primary" />
                        <h1 className="text-2xl font-bold">MindBridge</h1>
                    </div>
                    <CardTitle>Welcome! Let's get you set up.</CardTitle>
                    <CardDescription>Step {step} of {totalSteps}</CardDescription>
                    <Progress value={progress} className="w-full mt-2" />
                </CardHeader>
                <CardContent>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={pageVariants}
                            transition={pageTransition}
                        >
                            {step === 1 && (
                                <Form {...accountForm}>
                                    <form onSubmit={accountForm.handleSubmit(onAccountSubmit)} className="space-y-4">
                                        <FormField control={accountForm.control} name="name" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full Name</FormLabel>
                                                <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField control={accountForm.control} name="email" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField control={accountForm.control} name="password" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField control={accountForm.control} name="role" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>I am a...</FormLabel>
                                                <FormControl>
                                                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                                                        <FormItem className="flex items-center space-x-2">
                                                            <FormControl><RadioGroupItem value="patient" id="patient" /></FormControl>
                                                            <Label htmlFor="patient">Patient</Label>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-2">
                                                            <FormControl><RadioGroupItem value="psychologist" id="psychologist" /></FormControl>
                                                            <Label htmlFor="psychologist">Psychologist</Label>
                                                        </FormItem>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <Button type="submit" className="w-full">Next</Button>
                                    </form>
                                </Form>
                            )}

                            {step === 2 && (
                                <Form {...assessmentForm}>
                                    <form onSubmit={assessmentForm.handleSubmit(onAssessmentSubmit)} className="space-y-6">
                                        <FormField control={assessmentForm.control} name="mood" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>How are you feeling today?</FormLabel>
                                                <FormControl>
                                                    <>
                                                        <Slider
                                                            onValueChange={(value) => field.onChange(value[0])}
                                                            defaultValue={[field.value]}
                                                            max={10}
                                                            step={1}
                                                        />
                                                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                                            <Frown /> <Meh /> <Smile />
                                                        </div>
                                                    </>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField control={assessmentForm.control} name="primaryConcern" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>What's your primary concern?</FormLabel>
                                                <FormControl>
                                                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-2 gap-2">
                                                        {["Anxiety", "Depression", "Focus", "Sleep", "Stress", "Other"].map(concern => (
                                                            <FormItem key={concern}>
                                                                <FormControl>
                                                                    <RadioGroupItem value={concern} id={concern} className="sr-only" />
                                                                </FormControl>
                                                                <Label htmlFor={concern} className="flex items-center justify-center p-3 border rounded-md cursor-pointer hover:bg-accent [&:has([data-state=checked])]:bg-primary [&:has([data-state=checked])]:text-primary-foreground">
                                                                    {concern}
                                                                </Label>
                                                            </FormItem>
                                                        ))}
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <div className="flex justify-between">
                                            <Button type="button" variant="outline" onClick={handleBack}>Back</Button>
                                            <Button type="submit">Next</Button>
                                        </div>
                                    </form>
                                </Form>
                            )}

                            {step === 3 && (
                                <Form {...consentForm}>
                                    <form onSubmit={consentForm.handleSubmit(onConsentSubmit)} className="space-y-6 text-center">
                                        <div className="flex justify-center">
                                            <ShieldCheck className="w-12 h-12 text-green-500" />
                                        </div>
                                        <h3 className="text-xl font-semibold">Privacy & Consent</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Your privacy is paramount. Please review our data usage policy before continuing. We use technology to provide insights, but your data is handled with the utmost care.
                                        </p>
                                        <FormField control={consentForm.control} name="consent" render={({ field }) => (
                                            <FormItem className="flex items-start space-x-3 justify-center">
                                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                                <div className="grid gap-1.5 leading-none">
                                                    <label htmlFor="consent" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                        I agree to the terms and conditions.
                                                    </label>
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button variant="link" className="p-0 h-auto text-sm justify-start">View Terms</Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Terms & Consent</DialogTitle>
                                                                <DialogDescription>
                                                                    This platform uses camera and microphone data for real-time analysis to provide behavioral cues. By consenting, you agree to:
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                                                                <li>The capture and on-device analysis of video and audio during active sessions.</li>
                                                                <li>The storage of anonymized, aggregated data for research and model improvement.</li>
                                                                <li>The option to share session summaries with a connected clinician.</li>
                                                                <li>Data is for assistive insights only and is not a medical diagnosis.</li>
                                                            </ul>
                                                            <DialogFooter>
                                                                <p className="text-xs text-muted-foreground">You can manage these permissions at any time in your profile settings.</p>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>
                                            </FormItem>
                                        )} />
                                        <FormMessage>{consentForm.formState.errors.consent?.message}</FormMessage>
                                        <div className="flex justify-between">
                                            <Button type="button" variant="outline" onClick={handleBack}>Back</Button>
                                            <Button type="submit" disabled={loading}>{loading ? "Creating Account..." : "Create Account"}</Button>
                                        </div>
                                    </form>
                                </Form>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-sm text-muted-foreground">
                        Already have an account? <Link to="/login" className="text-primary hover:underline">Sign In</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default OnboardingPage;
