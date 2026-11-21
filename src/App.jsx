import { ZETAEXPLORER_CANARY } from './data/provenance-canary.js';
if (typeof window !== 'undefined') window.__ZX_CANARY = ZETAEXPLORER_CANARY;
import React, { useState, useEffect, useMemo, useRef, Suspense, lazy } from 'react';
import { ED as ED_TOKENS } from './styles/tokens.js';
import { HashRouter, Routes, Route, NavLink, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { MathModalProvider } from './components/KaTeXMath.jsx';
import HomePageEditorial from './pages/HomePageEditorial.jsx';
import RouteErrorBoundary from './components/RouteErrorBoundary.jsx';
import { NAV_GROUPS, NAV_DROPPED, NAV_SEARCH_ONLY } from './data/nav-groups.js';
import './styles/app.css';
import './styles/editorial.css';
import { isEditorialRoute, isVizLegacyRoute } from './data/editorial-routes.js';
import { getConceptIndex, loadConceptRegistry } from './components/conceptRegistryClient.js';
import { EditorialHeader, GroupDropdown, ModeSwitch, useDropdownRow, useMenuPanel } from './components/editorial/PostLayout.jsx';

// Lazy-load all pages except the editorial landing for code-splitting
const HomePage = lazy(() => import('./pages/HomePage.jsx')); // legacy dark home, now /classic
const DirectoryPage = lazy(() => import('./pages/DirectoryPage.jsx'));
const AtlasPage = lazy(() => import('./pages/AtlasPage.jsx'));
const GuidePage = lazy(() => import('./pages/GuidePage.jsx'));
const SimulatorsPage = lazy(() => import('./pages/SimulatorsPage.jsx'));
const NoGosPage = lazy(() => import('./pages/NoGosPage.jsx'));
const ResultsPage = lazy(() => import('./pages/ResultsPage.jsx'));
const ThreadsPage = lazy(() => import('./pages/ThreadsPage.jsx'));
const StateOfFieldPage = lazy(() => import('./pages/StateOfFieldPage.jsx'));
const PermutationArchitecturePage = lazy(() => import('./pages/PermutationArchitecturePage.jsx'));
const LambdaCandidate01758354Page = lazy(() => import('./pages/LambdaCandidate01758354Page.jsx'));
const LambdaQrhConditionalPage = lazy(() => import('./pages/LambdaQrhConditionalPage.jsx'));
const KeyResultsPage = lazy(() => import('./pages/KeyResultsPage.jsx'));
const AutonomousFleetPage = lazy(() => import('./pages/AutonomousFleetPage.jsx'));
const CriticalLineProportionPage = lazy(() => import('./pages/CriticalLineProportionPage.jsx'));
const PapersDownloadPage = lazy(() => import('./pages/PapersDownloadPage.jsx'));
const OscillatorsPage = lazy(() => import('./pages/OscillatorsPage.jsx'));
const HamiltonianPage = lazy(() => import('./pages/HamiltonianPage.jsx'));
const ZetaPage = lazy(() => import('./pages/ZetaPage.jsx'));
const ControlTheoryPage = lazy(() => import('./pages/ControlTheoryPage.jsx'));
const StatisticsPage = lazy(() => import('./pages/StatisticsPage.jsx'));
const ModesPage = lazy(() => import('./pages/ModesPage.jsx'));
const ExplorationsPage = lazy(() => import('./pages/ExplorationsPage.jsx'));
const LiteraturePage = lazy(() => import('./pages/LiteraturePage.jsx'));
const SimulatorPage = lazy(() => import('./pages/SimulatorPage.jsx'));
const FourierPage = lazy(() => import('./pages/FourierPage.jsx'));
const SupercriticalPage = lazy(() => import('./pages/SupercriticalPage.jsx'));
const DeBruijnDeparturePage = lazy(() => import('./pages/DeBruijnDeparturePage.jsx'));
const PtFloorSensitivityAuditPage = lazy(() => import('./pages/PtFloorSensitivityAuditPage.jsx'));
const RouteMCohort2AuditIndexPage = lazy(() => import('./pages/RouteMCohort2AuditIndexPage.jsx'));
const ReachFrontierDatasetAuditPage = lazy(() => import('./pages/ReachFrontierDatasetAuditPage.jsx'));
const VerifiedHeightLeverPage = lazy(() => import('./pages/VerifiedHeightLeverPage.jsx'));
const MollifiedBarrierCertificatePage = lazy(() => import('./pages/MollifiedBarrierCertificatePage.jsx'));
const FormalizationStatusPage = lazy(() => import('./pages/FormalizationStatusPage.jsx'));
const FormalizationReviewPage = lazy(() => import('./pages/FormalizationReviewPage.jsx'));
const FrozenRungPTEquivalencePage = lazy(() => import('./pages/FrozenRungPTEquivalencePage.jsx'));
const FlowBlindnessNoGoPage = lazy(() => import('./pages/FlowBlindnessNoGoPage.jsx'));
const SubHalfStripPccCriterionPage = lazy(() => import('./pages/SubHalfStripPccCriterionPage.jsx'));
const ZeroDensityScopingPage = lazy(() => import('./pages/ZeroDensityScopingPage.jsx'));
const GuthMaynardScopingPage = lazy(() => import('./pages/GuthMaynardScopingPage.jsx'));
const ObstructionSeamPage = lazy(() => import('./pages/ObstructionSeamPage.jsx'));
const DocsPage = lazy(() => import('./pages/DocsPage.jsx'));
const ImprovementsPage = lazy(() => import('./pages/ImprovementsPage.jsx'));
const WaveSimPage = lazy(() => import('./pages/WaveSimPage.jsx'));
const RHRigorPage = lazy(() => import('./pages/RHRigorPage.jsx'));
const TwistorPage = lazy(() => import('./pages/TwistorPage.jsx'));
const PaperPage = lazy(() => import('./pages/PaperPage.jsx'));
const HistoryPage = lazy(() => import('./pages/HistoryPage.jsx'));
const ConceptsPage = lazy(() => import('./pages/ConceptsPage.jsx'));
const ConceptDetailPage = lazy(() => import('./pages/ConceptDetailPage.jsx'));
const ConceptClassPage = lazy(() => import('./pages/ConceptClassPage.jsx'));
const SurrogateModelPage = lazy(() => import('./pages/SurrogateModelPage.jsx'));
const PascalPage = lazy(() => import('./pages/PascalPage.jsx'));
const ZXCalculusPage = lazy(() => import('./pages/ZXCalculusPage.jsx'));
const RHAttackPage = lazy(() => import('./pages/RHAttackPage.jsx'));
const RHResearchModulesPage = lazy(() => import('./pages/RHResearchModulesPage.jsx'));
const RHResearchModulePage = lazy(() => import('./pages/RHResearchModulePage.jsx'));
const InformationTheoryPage = lazy(() => import('./pages/InformationTheoryPage.jsx'));
const FormalProofPage = lazy(() => import('./pages/FormalProofPage.jsx'));
const OddZetaPage = lazy(() => import('./pages/OddZetaPage.jsx'));
const GapClosingPage = lazy(() => import('./pages/GapClosingPage.jsx'));
const SpectralAttackPage = lazy(() => import('./pages/SpectralAttackPage.jsx'));
const ProofCheckerPage = lazy(() => import('./pages/ProofCheckerPage.jsx'));
const HistoricalReasoningPage = lazy(() => import('./pages/HistoricalReasoningPage.jsx'));
const PaperUploadPage = lazy(() => import('./pages/PaperUploadPage.jsx'));
const PapersListPage = lazy(() => import('./pages/PapersListPage.jsx'));
const TwinLadderPage = lazy(() => import('./pages/TwinLadderPage.jsx'));
const CalabiYauPage = lazy(() => import('./pages/CalabiYauPage.jsx'));
const CrossAttackPage = lazy(() => import('./pages/CrossAttackPage.jsx'));
const ProofPlannerPage = lazy(() => import('./pages/ProofPlannerPage.jsx'));
const ImprovementQueuePage = lazy(() => import('./pages/ImprovementQueuePage.jsx'));
const ProofOverviewPage = lazy(() => import('./pages/ProofOverviewPage.jsx'));
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const BreakItPage = lazy(() => import('./pages/BreakItPage.jsx'));
const ProofExplorerPage = lazy(() => import('./pages/ProofExplorerPage.jsx'));
const BlogPage = lazy(() => import('./pages/BlogPage.jsx'));
const WikiPage = lazy(() => import('./pages/WikiPage.jsx'));
const ProjectIndexPage = lazy(() => import('./pages/ProjectIndexPage.jsx'));
const ResearchJournalPage = lazy(() => import('./pages/ResearchJournalPage.jsx'));
const MetaAccelerationPage = lazy(() => import('./pages/MetaAccelerationPage.jsx'));
const LambdaBoundsPage = lazy(() => import('./pages/LambdaBoundsPage.jsx'));
const NewmanLambda01787854CandidatePage = lazy(() => import('./pages/NewmanLambda01787854CandidatePage.jsx'));
const LambdaTimelinePage = lazy(() => import('./pages/LambdaTimelinePage.jsx'));
const RhDagPage = lazy(() => import('./pages/RhDagPage.jsx'));
const FrontierDagPage = lazy(() => import('./pages/FrontierDagPage.jsx'));
const ProgramDagPage = lazy(() => import('./pages/ProgramDagPage.jsx'));
const RhLandscapeDagPage = lazy(() => import('./pages/RhLandscapeDagPage.jsx'));
const ProjectDagPage = lazy(() => import('./pages/ProjectDagPage.jsx'));
const RigorDashboardPage = lazy(() => import('./pages/RigorDashboardPage.jsx'));
const DysonVerifierPage = lazy(() => import('./pages/DysonVerifierPage.jsx'));
const HealthPage = lazy(() => import('./pages/HealthPage.jsx'));
const FullStoryPage = lazy(() => import('./pages/FullStoryPage.jsx'));
const GramPointsPage = lazy(() => import('./pages/GramPointsPage.jsx'));
const SelbergTracePage = lazy(() => import('./pages/SelbergTracePage.jsx'));
const RHEquivalentsPage = lazy(() => import('./pages/RHEquivalentsPage.jsx'));
const ThreeAttacksPage = lazy(() => import('./pages/ThreeAttacksPage.jsx'));
const BlaschkeGhostsPage = lazy(() => import('./pages/BlaschkeGhostsPage.jsx'));
const ClosureRoutesPage = lazy(() => import('./pages/ClosureRoutesPage.jsx'));
const KypBoundedRealPage = lazy(() => import('./pages/KypBoundedRealPage.jsx'));
const ShiftBridgePositivityPage = lazy(() => import('./pages/ShiftBridgePositivityPage.jsx'));
const FreezingBridgePage = lazy(() => import('./pages/FreezingBridgePage.jsx'));
const RigorousNumericsStagesPage = lazy(() => import('./pages/RigorousNumericsStagesPage.jsx'));
const TwinLadderPaperRoadmapPage = lazy(() => import('./pages/TwinLadderPaperRoadmapPage.jsx'));
const PaperAuditDashboardPage = lazy(() => import('./pages/PaperAuditDashboardPage.jsx'));
const PCCRouteExhaustionPage = lazy(() => import('./pages/PCCRouteExhaustionPage.jsx'));
const HtCorridorCertificatesPage = lazy(() => import('./pages/HtCorridorCertificatesPage.jsx'));
const HtFiniteWindowPage = lazy(() => import('./pages/HtFiniteWindowPage.jsx'));
const VizHyperbolicPrimeSpiralPage = lazy(() => import('./pages/VizHyperbolicPrimeSpiralPage.jsx'));
const HiddenSquareProgramPage = lazy(() => import('./pages/HiddenSquareProgramPage.jsx'));
const ReciprocalProgramPage = lazy(() => import('./pages/ReciprocalProgramPage.jsx'));
const VizLogPhaseSpiralPage = lazy(() => import('./pages/VizLogPhaseSpiralPage.jsx'));
const VizEulerTransportFlowPage = lazy(() => import('./pages/VizEulerTransportFlowPage.jsx'));
const HardyZPage = lazy(() => import('./pages/HardyZPage.jsx'));
const VizTwinLadderTomographyPage = lazy(() => import('./pages/VizTwinLadderTomographyPage.jsx'));
const VizPrimeCausticPage = lazy(() => import('./pages/VizPrimeCausticPage.jsx'));
const VizPrimeDensityOnCausticPage = lazy(() => import('./pages/VizPrimeDensityOnCausticPage.jsx'));
const VizPrimePhaseCrystalPage = lazy(() => import('./pages/VizPrimePhaseCrystalPage.jsx'));
const VisualizationsIndexPage = lazy(() => import('./pages/VisualizationsIndexPage.jsx'));
const AnimationsPage = lazy(() => import('./pages/AnimationsPage.jsx'));
const VolterraKernelHeatmapPage = lazy(() => import('./pages/VolterraKernelHeatmapPage.jsx'));
const VolterraNormCurvePage = lazy(() => import('./pages/VolterraNormCurvePage.jsx'));
const VolterraBoundPage = lazy(() => import('./pages/VolterraBoundPage.jsx'));
const SchattenTraceNormPage = lazy(() => import('./pages/SchattenTraceNormPage.jsx'));
const CayleySchurTrajectoryPage = lazy(() => import('./pages/CayleySchurTrajectoryPage.jsx'));
const CollapseChainPage = lazy(() => import('./pages/CollapseChainPage.jsx'));
const RHProofStateDashboardPage = lazy(() => import('./pages/RHProofStateDashboardPage.jsx'));
const WhatWeKnowPage = lazy(() => import('./pages/WhatWeKnowPage.jsx'));
const RouteBLimsupPage = lazy(() => import('./pages/RouteBLimsupPage.jsx'));
const RouteMapPage = lazy(() => import('./pages/RouteMapPage.jsx'));
const DiagramGalleryPage = lazy(() => import('./pages/DiagramGalleryPage.jsx'));
const CatalanSignedLadderPage = lazy(() => import('./pages/CatalanSignedLadderPage.jsx'));
const IrrationalityPipelinePage = lazy(() => import('./pages/IrrationalityPipelinePage.jsx'));
const StateOfProgramPage = lazy(() => import('./pages/StateOfProgramPage.jsx'));
const EngineRoomPage = lazy(() => import('./pages/EngineRoomPage.jsx'));
const VortexFieldPage = lazy(() => import('./pages/VortexFieldPage.jsx'));
const SignSwitchingPage = lazy(() => import('./pages/SignSwitchingPage.jsx'));
const VizWindingDysonFlowPage = lazy(() => import('./pages/VizWindingDysonFlowPage.jsx'));
const VizNearZeroPage = lazy(() => import('./pages/VizNearZeroPage.jsx'));
const VisualGeometriesPage = lazy(() => import('./pages/VisualGeometriesPage.jsx'));
const PrimeRigidityPage = lazy(() => import('./pages/PrimeRigidityPage.jsx'));
const VizEulerProductPage = lazy(() => import('./pages/VizEulerProductPage.jsx'));
const VizCostFloorPage = lazy(() => import('./pages/VizCostFloorPage.jsx'));
const VizWindowLandscapePage = lazy(() => import('./pages/VizWindowLandscapePage.jsx'));
const VizFreezeFlowPage = lazy(() => import('./pages/VizFreezeFlowPage.jsx'));
const VizCausticResonancePage = lazy(() => import('./pages/VizCausticResonancePage.jsx'));
const VizPhaseCylinderPage = lazy(() => import('./pages/VizPhaseCylinderPage.jsx'));
const VizTwistorDualIntertwinerPage = lazy(() => import('./pages/VizTwistorDualIntertwinerPage.jsx'));
const VizUnwrappedRaysPage = lazy(() => import('./pages/VizUnwrappedRaysPage.jsx'));
const VizZoomHierarchyPage = lazy(() => import('./pages/VizZoomHierarchyPage.jsx'));
const AngularSpacingStatsPage = lazy(() => import('./pages/AngularSpacingStatsPage.jsx'));
const MillsTheoremPage = lazy(() => import('./pages/MillsTheoremPage.jsx'));
const GilbreathObservationPage = lazy(() => import('./pages/GilbreathObservationPage.jsx'));
const BerryKeatingXpPage = lazy(() => import('./pages/BerryKeatingXpPage.jsx'));
const ConnesAdelicPage = lazy(() => import('./pages/ConnesAdelicPage.jsx'));
const EdgeRigidityPage = lazy(() => import('./pages/EdgeRigidityPage.jsx'));
const EsyRigidityEmpiricalPage = lazy(() => import('./pages/EsyRigidityEmpiricalPage.jsx'));
const GueComparisonPage = lazy(() => import('./pages/GueComparisonPage.jsx'));
const LmfdbCrossReferencePage = lazy(() => import('./pages/LmfdbCrossReferencePage.jsx'));
const PairCorrelationPage = lazy(() => import('./pages/PairCorrelationPage.jsx'));
const RiemannSiegelZPage = lazy(() => import('./pages/RiemannSiegelZPage.jsx'));
const VoroninUniversalityPage = lazy(() => import('./pages/VoroninUniversalityPage.jsx'));
const ThetaSeizingMarginPage = lazy(() => import('./pages/ThetaSeizingMarginPage.jsx'));
const ThetaStaticObstructionPage = lazy(() => import('./pages/ThetaStaticObstructionPage.jsx'));
const ThetaBasinClosurePage = lazy(() => import('./pages/ThetaBasinClosurePage.jsx'));
const TheoremBThresholdPage = lazy(() => import('./pages/TheoremBThresholdPage.jsx'));
const OnsetBracketLedgerPage = lazy(() => import('./pages/OnsetBracketLedgerPage.jsx'));
const OpenFrontierPage = lazy(() => import('./pages/OpenFrontierPage.jsx'));
const Section26ConditioningArtifactPage = lazy(() => import('./pages/Section26ConditioningArtifactPage.jsx'));
const ExcessFractionPhiPage = lazy(() => import('./pages/ExcessFractionPhiPage.jsx'));
const CShockNumericalCoincidencePage = lazy(() => import('./pages/CShockNumericalCoincidencePage.jsx'));
const Imp3256CrossvalPage = lazy(() => import('./pages/Imp3256CrossvalPage.jsx'));
const Imp3252ScaledMuPage = lazy(() => import('./pages/Imp3252ScaledMuPage.jsx'));
const Imp3467ClosedFormCViz = lazy(() => import('./pages/Imp3467ClosedFormCViz.jsx'));
const Imp3540PowerIterationBudgetViz = lazy(() => import('./pages/Imp3540PowerIterationBudgetViz.jsx'));
const Imp3541CoshCancellationMarginViz = lazy(() => import('./pages/Imp3541CoshCancellationMarginViz.jsx'));
const Imp3542DegreeDMissFactorViz = lazy(() => import('./pages/Imp3542DegreeDMissFactorViz.jsx'));
const Imp3543XiStarRobustnessViz = lazy(() => import('./pages/Imp3543XiStarRobustnessViz.jsx'));
const Imp3563QuadratureStraddleViz = lazy(() => import('./pages/Imp3563QuadratureStraddleViz.jsx'));
const Imp3564PowerIterationClosedFormViz = lazy(() => import('./pages/Imp3564PowerIterationClosedFormViz.jsx'));
const Imp3565SigmaPostpeakDecayExponentViz = lazy(() => import('./pages/Imp3565SigmaPostpeakDecayExponentViz.jsx'));
const Imp3566CoshSinhMarginContrastViz = lazy(() => import('./pages/Imp3566CoshSinhMarginContrastViz.jsx'));
const Imp3586SigmaCrossingLogisticDropViz = lazy(() => import('./pages/Imp3586SigmaCrossingLogisticDropViz.jsx'));
const Imp3567ClosedErrorCertificateViz = lazy(() => import('./pages/Imp3567ClosedErrorCertificateViz.jsx'));
const Imp3589CoshOverestimationFactorViz = lazy(() => import('./pages/Imp3589CoshOverestimationFactorViz.jsx'));
const Imp3611SkewToeplitzKrylovGapLadderViz = lazy(() => import('./pages/Imp3611SkewToeplitzKrylovGapLadderViz.jsx'));
const Imp3612FitBiasDepthSweepViz = lazy(() => import('./pages/Imp3612FitBiasDepthSweepViz.jsx'));
const Imp3629RemainderTailCoeffLadderViz = lazy(() => import('./pages/Imp3629RemainderTailCoeffLadderViz.jsx'));
const Imp3738FmbPlateauEnclosureViz = lazy(() => import('./pages/Imp3738FmbPlateauEnclosureViz.jsx'));
const Imp3864FmbSmallNEnclosureViz = lazy(() => import('./pages/Imp3864FmbSmallNEnclosureViz.jsx'));
const Imp3613ReplicaFoldInGeometryViz = lazy(() => import('./pages/Imp3613ReplicaFoldInGeometryViz.jsx'));
const Imp3614SigmaCrossoverFloorInvarianceViz = lazy(() => import('./pages/Imp3614SigmaCrossoverFloorInvarianceViz.jsx'));
const Imp3627FlowGapNextorderViz = lazy(() => import('./pages/Imp3627FlowGapNextorderViz.jsx'));
const Imp3655FlowGapResidualLadderViz = lazy(() => import('./pages/Imp3655FlowGapResidualLadderViz.jsx'));
const Imp3633TwinSkewToeplitzGapLadderViz = lazy(() => import('./pages/Imp3633TwinSkewToeplitzGapLadderViz.jsx'));
const Imp3656TripleSkewToeplitzGapLadderViz = lazy(() => import('./pages/Imp3656TripleSkewToeplitzGapLadderViz.jsx'));
const Imp3657SigmaCrossoverTcClosedformPinViz = lazy(() => import('./pages/Imp3657SigmaCrossoverTcClosedformPinViz.jsx'));
const Imp3658PlantedReplicaArgmaxDriftViz = lazy(() => import('./pages/Imp3658PlantedReplicaArgmaxDriftViz.jsx'));
const Imp3695FeatureFoldinFloorLadderViz = lazy(() => import('./pages/Imp3695FeatureFoldinFloorLadderViz.jsx'));
const Imp96058FejerCeilingFloorLadderViz = lazy(() => import('./pages/Imp96058FejerCeilingFloorLadderViz.jsx'));
const Imp96059DetectorReachLadderViz = lazy(() => import('./pages/Imp96059DetectorReachLadderViz.jsx'));
const Imp96060LittlewoodJensenLossViz = lazy(() => import('./pages/Imp96060LittlewoodJensenLossViz.jsx'));
const Imp3677SkewToeplitzKrylovDepthVsNLawViz = lazy(() => import('./pages/Imp3677SkewToeplitzKrylovDepthVsNLawViz.jsx'));
const Imp3696MatchedPairKrylovDepthSweepViz = lazy(() => import('./pages/Imp3696MatchedPairKrylovDepthSweepViz.jsx'));
const Imp3697AWeightDecayCrosscheckViz = lazy(() => import('./pages/Imp3697AWeightDecayCrosscheckViz.jsx'));
const Imp3698FifthPairAdjacentPairingViz = lazy(() => import('./pages/Imp3698FifthPairAdjacentPairingViz.jsx'));
const Imp3699FitBiasDecayViz = lazy(() => import('./pages/Imp3699FitBiasDecayViz.jsx'));
const Imp3700MesoscopicShockScaleSeparationViz = lazy(() => import('./pages/Imp3700MesoscopicShockScaleSeparationViz.jsx'));
const Imp3374OverflowDegreeViz = lazy(() => import('./pages/Imp3374OverflowDegreeViz.jsx'));
const Imp3375InterloperMarginViz = lazy(() => import('./pages/Imp3375InterloperMarginViz.jsx'));
const Imp3376KShellOnsetLadderViz = lazy(() => import('./pages/Imp3376KShellOnsetLadderViz.jsx'));
const Imp3377RescueBudgetHeightMapViz = lazy(() => import('./pages/Imp3377RescueBudgetHeightMapViz.jsx'));
const Imp3380PathOneRecordStepMarginViz = lazy(() => import('./pages/Imp3380PathOneRecordStepMarginViz.jsx'));
const Imp3631MfoldAliasingThresholdLadderViz = lazy(() => import('./pages/Imp3631MfoldAliasingThresholdLadderViz.jsx'));
const Imp3635FlowFactorBandViz = lazy(() => import('./pages/Imp3635FlowFactorBandViz.jsx'));
const Imp3672DirectDysonFlowCrosscheckViz = lazy(() => import('./pages/Imp3672DirectDysonFlowCrosscheckViz.jsx'));
const Imp3675DenseLanczosPairSpreadCrossoverViz = lazy(() => import('./pages/Imp3675DenseLanczosPairSpreadCrossoverViz.jsx'));
const Imp3678MomentRatioAsymptoticsViz = lazy(() => import('./pages/Imp3678MomentRatioAsymptoticsViz.jsx'));
const Imp3681SubFloorReplicaFoldinCrossoverViz = lazy(() => import('./pages/Imp3681SubFloorReplicaFoldinCrossoverViz.jsx'));
const Imp3860AWeightCorrectionLimitViz = lazy(() => import('./pages/Imp3860AWeightCorrectionLimitViz.jsx'));
const Imp3861MomentRatioDecayLadderViz = lazy(() => import('./pages/Imp3861MomentRatioDecayLadderViz.jsx'));
const Imp3862SaddleRatioCrossingViz = lazy(() => import('./pages/Imp3862SaddleRatioCrossingViz.jsx'));
const Imp3863GapStructureFunctionViz = lazy(() => import('./pages/Imp3863GapStructureFunctionViz.jsx'));
const Imp3880SaddleRatioInnerConvergedViz = lazy(() => import('./pages/Imp3880SaddleRatioInnerConvergedViz.jsx'));
const Imp3881EpsSignChangeViz = lazy(() => import('./pages/Imp3881EpsSignChangeViz.jsx'));
const Imp3882SaddleCorrectionLadderViz = lazy(() => import('./pages/Imp3882SaddleCorrectionLadderViz.jsx'));
const Imp3883AWeightSimpsonClimbViz = lazy(() => import('./pages/Imp3883AWeightSimpsonClimbViz.jsx'));
const Imp3884ThetabarElasticityViz = lazy(() => import('./pages/Imp3884ThetabarElasticityViz.jsx'));
const Imp3900H2FluxConvexityViz = lazy(() => import('./pages/Imp3900H2FluxConvexityViz.jsx'));
const Imp3903SminDminSlackViz = lazy(() => import('./pages/Imp3903SminDminSlackViz.jsx'));
const Imp3904TwoSolverCrossingViz = lazy(() => import('./pages/Imp3904TwoSolverCrossingViz.jsx'));
const Imp3906DpsiSensitivityViz = lazy(() => import('./pages/Imp3906DpsiSensitivityViz.jsx'));
const Imp3927ThreeSolverCrossingViz = lazy(() => import('./pages/Imp3927ThreeSolverCrossingViz.jsx'));
const Imp3928InviscidWindowEdgeBlocksizeViz = lazy(() => import('./pages/Imp3928InviscidWindowEdgeBlocksizeViz.jsx'));
const Imp3929HorizonElasticitySharpeningViz = lazy(() => import('./pages/Imp3929HorizonElasticitySharpeningViz.jsx'));
const Imp33214SaddleRatioDeepTailRecoveryViz = lazy(() => import('./pages/Imp33214SaddleRatioDeepTailRecoveryViz.jsx'));
const Imp33217FifthPairSpreadUlpFloorLadderViz = lazy(() => import('./pages/Imp33217FifthPairSpreadUlpFloorLadderViz.jsx'));
const Imp33264FifthPairSpreadLadderN2800ExtendedViz = lazy(() => import('./pages/Imp33264FifthPairSpreadLadderN2800ExtendedViz.jsx'));
const Imp33298FifthPairPrecisionCollapseViz = lazy(() => import('./pages/Imp33298FifthPairPrecisionCollapseViz.jsx'));
const Imp33300MajorantOverchargePlateauViz = lazy(() => import('./pages/Imp33300MajorantOverchargePlateauViz.jsx'));
const Imp33302SlidingStartExponentLadderViz = lazy(() => import('./pages/Imp33302SlidingStartExponentLadderViz.jsx'));
const Imp33219AWeightTwoRouteReproductionViz = lazy(() => import('./pages/Imp33219AWeightTwoRouteReproductionViz.jsx'));
const Imp33246EpsCrossvalViz = lazy(() => import('./pages/Imp33246EpsCrossvalViz.jsx'));
const Imp33257NodeBudgetFullWindowUlpViz = lazy(() => import('./pages/Imp33257NodeBudgetFullWindowUlpViz.jsx'));
const Imp33261SaddleWindowDirectVsLogAViz = lazy(() => import('./pages/Imp33261SaddleWindowDirectVsLogAViz.jsx'));
const Imp33221ModelFidelityCrossingGapViz = lazy(() => import('./pages/Imp33221ModelFidelityCrossingGapViz.jsx'));
const Imp33237EpsFieldRobustTransferModulusViz = lazy(() => import('./pages/Imp33237EpsFieldRobustTransferModulusViz.jsx'));
const Imp33241WatsonMajorantRhoRatioLadderViz = lazy(() => import('./pages/Imp33241WatsonMajorantRhoRatioLadderViz.jsx'));
const Imp33243RecoveryRateFitViz = lazy(() => import('./pages/Imp33243RecoveryRateFitViz.jsx'));
const Imp33323MinNodeLatticeJitterBandViz = lazy(() => import('./pages/Imp33323MinNodeLatticeJitterBandViz.jsx'));
const Imp33324GradedVsUniformNodeBudgetViz = lazy(() => import('./pages/Imp33324GradedVsUniformNodeBudgetViz.jsx'));
const Imp33325FarTermTighterMajorantViz = lazy(() => import('./pages/Imp33325FarTermTighterMajorantViz.jsx'));
const Imp33326GenuineEigenvectorFifthPairRealizedCLadderViz = lazy(() => import('./pages/Imp33326GenuineEigenvectorFifthPairRealizedCLadderViz.jsx'));
const Imp33266ToolkitStatusMapViz = lazy(() => import('./pages/Imp33266ToolkitStatusMapViz.jsx'));
const Imp33267AWeightDualPathTau25To30Viz = lazy(() => import('./pages/Imp33267AWeightDualPathTau25To30Viz.jsx'));
const Imp33284R40InnerQuadratureLadderViz = lazy(() => import('./pages/Imp33284R40InnerQuadratureLadderViz.jsx'));
const Imp33304R40TwoAxisSeparationViz = lazy(() => import('./pages/Imp33304R40TwoAxisSeparationViz.jsx'));
const Imp33285WatsonBracketDirectVsReformDdLadderViz = lazy(() => import('./pages/Imp33285WatsonBracketDirectVsReformDdLadderViz.jsx'));
const Imp33286RealisedVsCertifiedTailWeightRatioViz = lazy(() => import('./pages/Imp33286RealisedVsCertifiedTailWeightRatioViz.jsx'));
const Imp33587BandCrossingFloorClimbViz = lazy(() => import('./pages/Imp33587BandCrossingFloorClimbViz.jsx'));
const Imp33591DeepTailCrossSolverNodeBudgetViz = lazy(() => import('./pages/Imp33591DeepTailCrossSolverNodeBudgetViz.jsx'));
const Imp33594EnvelopeUnderReferenceLibmViz = lazy(() => import('./pages/Imp33594EnvelopeUnderReferenceLibmViz.jsx'));
const Imp33607SigmaPostpeakDecayViz = lazy(() => import('./pages/Imp33607SigmaPostpeakDecayViz.jsx'));
const Imp33609GradedMappedCcAbscissaArtifactViz = lazy(() => import('./pages/Imp33609GradedMappedCcAbscissaArtifactViz.jsx'));
const Imp33611BandCrossingFloorBisectionViz = lazy(() => import('./pages/Imp33611BandCrossingFloorBisectionViz.jsx'));
const Imp33613BandCrossingCrossSolverNodeBudgetViz = lazy(() => import('./pages/Imp33613BandCrossingCrossSolverNodeBudgetViz.jsx'));
const Imp33628EtruncEcollCrossoverViz = lazy(() => import('./pages/Imp33628EtruncEcollCrossoverViz.jsx'));
const Imp35121EcollEtruncEflowDecompositionViz = lazy(() => import('./pages/Imp35121EcollEtruncEflowDecompositionViz.jsx'));
const Imp35161EComponentDecompositionTableViz = lazy(() => import('./pages/Imp35161EComponentDecompositionTableViz.jsx'));
const Imp33629WideRangeBandCrossingEnvelopeViz = lazy(() => import('./pages/Imp33629WideRangeBandCrossingEnvelopeViz.jsx'));
const Imp33656MergedBandClearingOverviewViz = lazy(() => import('./pages/Imp33656MergedBandClearingOverviewViz.jsx'));
const Imp33676FullRangeBandClearingOverviewViz = lazy(() => import('./pages/Imp33676FullRangeBandClearingOverviewViz.jsx'));
const Imp33630GradeVsNodeBudgetViz = lazy(() => import('./pages/Imp33630GradeVsNodeBudgetViz.jsx'));
const Imp33547TiltClosureOffsetFractionViz = lazy(() => import('./pages/Imp33547TiltClosureOffsetFractionViz.jsx'));
const Imp33548GradedPlateauDeepTailNodeBudgetViz = lazy(() => import('./pages/Imp33548GradedPlateauDeepTailNodeBudgetViz.jsx'));
const Imp33549SigmaFarTailVsInteriorMaxViz = lazy(() => import('./pages/Imp33549SigmaFarTailVsInteriorMaxViz.jsx'));
const Imp33550MaxBjRealisedElasticityViz = lazy(() => import('./pages/Imp33550MaxBjRealisedElasticityViz.jsx'));
const Imp33570SigmaFarTailSlopeSqrtFractionViz = lazy(() => import('./pages/Imp33570SigmaFarTailSlopeSqrtFractionViz.jsx'));
const Imp33571DeepTailJitterEnvelopeViz = lazy(() => import('./pages/Imp33571DeepTailJitterEnvelopeViz.jsx'));
const Imp33572TauUniformEnvelopeViz = lazy(() => import('./pages/Imp33572TauUniformEnvelopeViz.jsx'));
const Imp33573R40CrossSolverNodeBudgetViz = lazy(() => import('./pages/Imp33573R40CrossSolverNodeBudgetViz.jsx'));
const Imp33694InterClusterTroughFloorViz = lazy(() => import('./pages/Imp33694InterClusterTroughFloorViz.jsx'));
const Imp33715GapVsHeightIndependenceViz = lazy(() => import('./pages/Imp33715GapVsHeightIndependenceViz.jsx'));
const Imp33716PeakMinusTroughAmplitudeViz = lazy(() => import('./pages/Imp33716PeakMinusTroughAmplitudeViz.jsx'));
const Imp33717EnvelopeHeightExtensionViz = lazy(() => import('./pages/Imp33717EnvelopeHeightExtensionViz.jsx'));
const Imp33718InterPeakGapSequenceViz = lazy(() => import('./pages/Imp33718InterPeakGapSequenceViz.jsx'));
const Imp33742InterPeakGapSequenceExtensionViz = lazy(() => import('./pages/Imp33742InterPeakGapSequenceExtensionViz.jsx'));
const Imp33675DenseNodeBudgetJitterViz = lazy(() => import('./pages/Imp33675DenseNodeBudgetJitterViz.jsx'));
const Imp33589HeightCollapsingEnvelopeCeilingViz = lazy(() => import('./pages/Imp33589HeightCollapsingEnvelopeCeilingViz.jsx'));
const Imp33595DeepTailCohortIndexPage = lazy(() => import('./pages/Imp33595DeepTailCohortIndexPage.jsx'));
const Imp33617DeepTailCrossSolverCohortIndexPage = lazy(() => import('./pages/Imp33617DeepTailCrossSolverCohortIndexPage.jsx'));
const Imp33830SigmaDecayLandmarkLadderViz = lazy(() => import('./pages/Imp33830SigmaDecayLandmarkLadderViz.jsx'));
const Imp33831EflowResidRatioLadderViz = lazy(() => import('./pages/Imp33831EflowResidRatioLadderViz.jsx'));
const Imp33832SaturationCurvatureHumpVsKViz = lazy(() => import('./pages/Imp33832SaturationCurvatureHumpVsKViz.jsx'));
const Imp33833DecoupledRateHeatmapViz = lazy(() => import('./pages/Imp33833DecoupledRateHeatmapViz.jsx'));
const Imp33731SigmaRampCurvatureViz = lazy(() => import('./pages/Imp33731SigmaRampCurvatureViz.jsx'));
const Imp33677ClusterPeakGapSequenceViz = lazy(() => import('./pages/Imp33677ClusterPeakGapSequenceViz.jsx'));
const Imp33864CrenGapOnsetLadderViz = lazy(() => import('./pages/Imp33864CrenGapOnsetLadderViz.jsx'));
const Imp33894ResidualShapeViz = lazy(() => import('./pages/Imp33894ResidualShapeViz.jsx'));
const Imp33895LogSaturationReconciliationViz = lazy(() => import('./pages/Imp33895LogSaturationReconciliationViz.jsx'));
const Imp33738GapVsTroughDepthCouplingViz = lazy(() => import('./pages/Imp33738GapVsTroughDepthCouplingViz.jsx'));
const Imp33800SigmaInflectionResidualContrastViz = lazy(() => import('./pages/Imp33800SigmaInflectionResidualContrastViz.jsx'));
const Imp33930CrossoverFixedPointConvergenceViz = lazy(() => import('./pages/Imp33930CrossoverFixedPointConvergenceViz.jsx'));
const Imp33931FartailFloorSensitivityScatterViz = lazy(() => import('./pages/Imp33931FartailFloorSensitivityScatterViz.jsx'));
const Imp33932SubdecadeExponentRampCurvatureViz = lazy(() => import('./pages/Imp33932SubdecadeExponentRampCurvatureViz.jsx'));
const Imp33950PerronNormCurveViz = lazy(() => import('./pages/Imp33950PerronNormCurveViz.jsx'));
const Imp33993GVsLawOffsetViz = lazy(() => import('./pages/Imp33993GVsLawOffsetViz.jsx'));
const Imp33994SawtoothGapVsStepViz = lazy(() => import('./pages/Imp33994SawtoothGapVsStepViz.jsx'));
const Imp33999ResidualCurvatureContrastViz = lazy(() => import('./pages/Imp33999ResidualCurvatureContrastViz.jsx'));
const Imp33915EndpointArtifactResidualMigrationViz = lazy(() => import('./pages/Imp33915EndpointArtifactResidualMigrationViz.jsx'));
const Imp34032WindingSlopeVsAlphaViz = lazy(() => import('./pages/Imp34032WindingSlopeVsAlphaViz.jsx'));
const Imp34033F1WideningDriftViz = lazy(() => import('./pages/Imp34033F1WideningDriftViz.jsx'));
const Imp34037RealnessResidualVsThetaViz = lazy(() => import('./pages/Imp34037RealnessResidualVsThetaViz.jsx'));
const Imp33953ResidExpHumpArgmaxCrossoverViz = lazy(() => import('./pages/Imp33953ResidExpHumpArgmaxCrossoverViz.jsx'));
const Imp34049FixedBandDriftGrowthViz = lazy(() => import('./pages/Imp34049FixedBandDriftGrowthViz.jsx'));
const Imp34050EndpointPeakModelTournamentViz = lazy(() => import('./pages/Imp34050EndpointPeakModelTournamentViz.jsx'));
const Imp34051LooEvidenceRatioStripViz = lazy(() => import('./pages/Imp34051LooEvidenceRatioStripViz.jsx'));
const Imp34052F3LandmarkThreeWaySpreadViz = lazy(() => import('./pages/Imp34052F3LandmarkThreeWaySpreadViz.jsx'));
const Imp34014EndpointPeakModelSelectionFitViz = lazy(() => import('./pages/Imp34014EndpointPeakModelSelectionFitViz.jsx'));
const Imp34098EndpointTroughMigrationViz = lazy(() => import('./pages/Imp34098EndpointTroughMigrationViz.jsx'));
const Imp34015F2MagShareDriftViz = lazy(() => import('./pages/Imp34015F2MagShareDriftViz.jsx'));
const Imp34016SigmaExponentVsLogT0Viz = lazy(() => import('./pages/Imp34016SigmaExponentVsLogT0Viz.jsx'));
const Imp34099AggregateShareWindowSensitivityViz = lazy(() => import('./pages/Imp34099AggregateShareWindowSensitivityViz.jsx'));
const Imp34100ApexParabolaWingFidelityViz = lazy(() => import('./pages/Imp34100ApexParabolaWingFidelityViz.jsx'));
const Imp34118SawtoothPhaseRealignmentScheduleViz = lazy(() => import('./pages/Imp34118SawtoothPhaseRealignmentScheduleViz.jsx'));
const Imp34101SerialDependenceTestPanelViz = lazy(() => import('./pages/Imp34101SerialDependenceTestPanelViz.jsx'));
const Imp34119PhaseZeroBranchGeometryViz = lazy(() => import('./pages/Imp34119PhaseZeroBranchGeometryViz.jsx'));
const Imp34185OuterBranchAngleFamilyViz = lazy(() => import('./pages/Imp34185OuterBranchAngleFamilyViz.jsx'));
const Imp34120EndpointPeakSaturatingTournamentViz = lazy(() => import('./pages/Imp34120EndpointPeakSaturatingTournamentViz.jsx'));
const Imp34078PointwiseVsWindowExponentViz = lazy(() => import('./pages/Imp34078PointwiseVsWindowExponentViz.jsx'));
const Imp34142WindowAnchorCentroidViz = lazy(() => import('./pages/Imp34142WindowAnchorCentroidViz.jsx'));
const Imp34156AsymmetricTrimAttributionViz = lazy(() => import('./pages/Imp34156AsymmetricTrimAttributionViz.jsx'));
const Imp34182DeepLadderPrecisionFloorViz = lazy(() => import('./pages/Imp34182DeepLadderPrecisionFloorViz.jsx'));
const Imp34157TroughPeakRatioCreepViz = lazy(() => import('./pages/Imp34157TroughPeakRatioCreepViz.jsx'));
const Imp34158DigitLossCliffViz = lazy(() => import('./pages/Imp34158DigitLossCliffViz.jsx'));
const Imp34159CubicTiltWingReconstructionViz = lazy(() => import('./pages/Imp34159CubicTiltWingReconstructionViz.jsx'));
const Imp34198EcollResidualMilestoneLadderViz = lazy(() => import('./pages/Imp34198EcollResidualMilestoneLadderViz.jsx'));
const Imp34077GeometricCenterTaylorReductionViz = lazy(() => import('./pages/Imp34077GeometricCenterTaylorReductionViz.jsx'));
const Imp34200LtoPerPairInfluenceBarChartViz = lazy(() => import('./pages/Imp34200LtoPerPairInfluenceBarChartViz.jsx'));
const Imp34203EndpointVsFixedBandPeakSaturationCrossViz = lazy(() => import('./pages/Imp34203EndpointVsFixedBandPeakSaturationCrossViz.jsx'));
const Imp34205WideningSlopeConvergenceViz = lazy(() => import('./pages/Imp34205WideningSlopeConvergenceViz.jsx'));
const Imp34221EflowEtruncRatioDecayOnsetViz = lazy(() => import('./pages/Imp34221EflowEtruncRatioDecayOnsetViz.jsx'));
const Imp34237FixedBandPeakReaccelAndSurrogatePoleViz = lazy(() => import('./pages/Imp34237FixedBandPeakReaccelAndSurrogatePoleViz.jsx'));
const Imp34238SevenCrossingsOnsetLadderViz = lazy(() => import('./pages/Imp34238SevenCrossingsOnsetLadderViz.jsx'));
const Imp34244KpssL0FlipShiftRankingViz = lazy(() => import('./pages/Imp34244KpssL0FlipShiftRankingViz.jsx'));
const Imp34255M2CeilingWindowWidthDivergenceViz = lazy(() => import('./pages/Imp34255M2CeilingWindowWidthDivergenceViz.jsx'));
const Imp34259UnifiedEndpointDistanceFamilyViz = lazy(() => import('./pages/Imp34259UnifiedEndpointDistanceFamilyViz.jsx'));
const Imp34274FixedBandPeakIncrementMinimumViz = lazy(() => import('./pages/Imp34274FixedBandPeakIncrementMinimumViz.jsx'));
const Imp34268FixedBandPeakReaccelConvexityStitchViz = lazy(() => import('./pages/Imp34268FixedBandPeakReaccelConvexityStitchViz.jsx'));
const Imp34281M2CeilingCohortIndexPage = lazy(() => import('./pages/Imp34281M2CeilingCohortIndexPage.jsx'));
const Imp34361EflowCrossoverOffsetCohortIndexPage = lazy(() => import('./pages/Imp34361EflowCrossoverOffsetCohortIndexPage.jsx'));
const Imp34356M2CeilingExactFitCoeffLadderViz = lazy(() => import('./pages/Imp34356M2CeilingExactFitCoeffLadderViz.jsx'));
const Imp34352EflowGronwallCrossoverOffsetViz = lazy(() => import('./pages/Imp34352EflowGronwallCrossoverOffsetViz.jsx'));
const Imp34353CrossoverSurplusFamilyDecayViz = lazy(() => import('./pages/Imp34353CrossoverSurplusFamilyDecayViz.jsx'));
const Imp34354CrossoverSurplusSmallThrFactorisationViz = lazy(() => import('./pages/Imp34354CrossoverSurplusSmallThrFactorisationViz.jsx'));
const Imp34355FarTailCrossoverResidualCollapseViz = lazy(() => import('./pages/Imp34355FarTailCrossoverResidualCollapseViz.jsx'));
const Imp34456CouplingRatioDriftLadderViz = lazy(() => import('./pages/Imp34456CouplingRatioDriftLadderViz.jsx'));
const Imp34457ResidueCurvatureCorrectedViz = lazy(() => import('./pages/Imp34457ResidueCurvatureCorrectedViz.jsx'));
const Imp34458DeflowFalloffViz = lazy(() => import('./pages/Imp34458DeflowFalloffViz.jsx'));
const Imp34459PeakRelocationRegimeWidthViz = lazy(() => import('./pages/Imp34459PeakRelocationRegimeWidthViz.jsx'));
const Imp34460TwoTermCurvatureCrossvalViz = lazy(() => import('./pages/Imp34460TwoTermCurvatureCrossvalViz.jsx'));
const Imp34514CouplingRatio1overLogT0FitViz = lazy(() => import('./pages/Imp34514CouplingRatio1overLogT0FitViz.jsx'));
const Imp34515SurplusAmplitudeRelDefConvergenceViz = lazy(() => import('./pages/Imp34515SurplusAmplitudeRelDefConvergenceViz.jsx'));
const Imp34516PoleLeakageLadderViz = lazy(() => import('./pages/Imp34516PoleLeakageLadderViz.jsx'));
const Imp34517NumeratorApproachAStabilityViz = lazy(() => import('./pages/Imp34517NumeratorApproachAStabilityViz.jsx'));
const Imp34522ConditionalityGapLandmarksViz = lazy(() => import('./pages/Imp34522ConditionalityGapLandmarksViz.jsx'));
const Imp34534PoleLeakageSinglePoleFitViz = lazy(() => import('./pages/Imp34534PoleLeakageSinglePoleFitViz.jsx'));
const Imp34562DeepRungDoublingMapLandmarksViz = lazy(() => import('./pages/Imp34562DeepRungDoublingMapLandmarksViz.jsx'));
const Imp34535DriftResidualVsStepSizeViz = lazy(() => import('./pages/Imp34535DriftResidualVsStepSizeViz.jsx'));
const Imp34542CrossoverExponentVsLogT0Viz = lazy(() => import('./pages/Imp34542CrossoverExponentVsLogT0Viz.jsx'));
const Imp34416CrossoverSurplusFartailCompositeLimitViz = lazy(() => import('./pages/Imp34416CrossoverSurplusFartailCompositeLimitViz.jsx'));
const Imp34269FixedBandPeakSharedGridCrossRecomputeViz = lazy(() => import('./pages/Imp34269FixedBandPeakSharedGridCrossRecomputeViz.jsx'));
const Imp34377ResidExpPoleCohortIndexPage = lazy(() => import('./pages/Imp34377ResidExpPoleCohortIndexPage.jsx'));
const Imp34378TroughPeakRatioCeilingViz = lazy(() => import('./pages/Imp34378TroughPeakRatioCeilingViz.jsx'));
const Imp34383D2SignChangeGridViz = lazy(() => import('./pages/Imp34383D2SignChangeGridViz.jsx'));
const Imp34417SigmaVsProductGapComplementViz = lazy(() => import('./pages/Imp34417SigmaVsProductGapComplementViz.jsx'));
const Imp34418WideningResidualPrepoleReversalViz = lazy(() => import('./pages/Imp34418WideningResidualPrepoleReversalViz.jsx'));
const Imp34419WideningSlopeMinusOneCrossingViz = lazy(() => import('./pages/Imp34419WideningSlopeMinusOneCrossingViz.jsx'));
const Imp34438EflowRatioRExponentLadderViz = lazy(() => import('./pages/Imp34438EflowRatioRExponentLadderViz.jsx'));
const Imp34439ThirdDiffPoleOrderViz = lazy(() => import('./pages/Imp34439ThirdDiffPoleOrderViz.jsx'));
const Imp34475FourLocatorClusterAxisViz = lazy(() => import('./pages/Imp34475FourLocatorClusterAxisViz.jsx'));
const Imp34494ResidueErrorBarViz = lazy(() => import('./pages/Imp34494ResidueErrorBarViz.jsx'));
const Imp34495DeflowDecayViz = lazy(() => import('./pages/Imp34495DeflowDecayViz.jsx'));
const Imp34496ExcessAboveTwoViz = lazy(() => import('./pages/Imp34496ExcessAboveTwoViz.jsx'));
const Imp34497CrossoverEnAssemblyViz = lazy(() => import('./pages/Imp34497CrossoverEnAssemblyViz.jsx'));
const Imp34498EnMonotoneDescentViz = lazy(() => import('./pages/Imp34498EnMonotoneDescentViz.jsx'));
const Imp34499BridgeSlopeThreeRungViz = lazy(() => import('./pages/Imp34499BridgeSlopeThreeRungViz.jsx'));
const Imp34540PoleLeakageFiveRungLadderViz = lazy(() =>
  import('./pages/Imp34540PoleLeakageFiveRungLadderViz.jsx'),
);
const Imp34476SigmaProductGapRatioApproachViz = lazy(() =>
  import('./pages/Imp34476SigmaProductGapRatioApproachViz.jsx')
);
const Imp34477WideningSlopePoleLeakageViz = lazy(() => import('./pages/Imp34477WideningSlopePoleLeakageViz.jsx'));
const Imp34478WideningSlopePrepoleLandmarkDecadeAxisViz = lazy(() =>
  import('./pages/Imp34478WideningSlopePrepoleLandmarkDecadeAxisViz.jsx')
);
const Imp33851HumpEnvelopeSymmetryVsKViz = lazy(() =>
  import('./pages/Imp33851HumpEnvelopeSymmetryVsKViz.jsx')
);
const Imp34528TailsideHumpDecayVsSqrtNFartailViz = lazy(() =>
  import('./pages/Imp34528TailsideHumpDecayVsSqrtNFartailViz.jsx')
);
const Imp34530PoleLeakageSpacingCompressionFitViz = lazy(() =>
  import('./pages/Imp34530PoleLeakageSpacingCompressionFitViz.jsx')
);
const Imp34529RecoveredPoleConvergenceViz = lazy(() =>
  import('./pages/Imp34529RecoveredPoleConvergenceViz.jsx')
);
const Imp34557HumpSkewMirrorViz = lazy(() =>
  import('./pages/Imp34557HumpSkewMirrorViz.jsx')
);
const Imp34574LocalSpacingExponentDescentViz = lazy(() =>
  import('./pages/Imp34574LocalSpacingExponentDescentViz.jsx')
);
const Imp34575NearPoleResolvabilityFloorsViz = lazy(() =>
  import('./pages/Imp34575NearPoleResolvabilityFloorsViz.jsx')
);
const Imp34551DeepRungArgmaxJitterViz = lazy(() =>
  import('./pages/Imp34551DeepRungArgmaxJitterViz.jsx')
);
const Imp34594EflowAttrFarSideSmoothnessLadderViz = lazy(() =>
  import('./pages/Imp34594EflowAttrFarSideSmoothnessLadderViz.jsx')
);
const Imp34570EflowAttrPowerLawFitViz = lazy(() =>
  import('./pages/Imp34570EflowAttrPowerLawFitViz.jsx')
);
const Imp34596DeflowObservedExponentViz = lazy(() =>
  import('./pages/Imp34596DeflowObservedExponentViz.jsx')
);
const Imp34597DriftShareRegimeSplitViz = lazy(() =>
  import('./pages/Imp34597DriftShareRegimeSplitViz.jsx')
);
const Imp34598Binary128CrossCheckViz = lazy(() =>
  import('./pages/Imp34598Binary128CrossCheckViz.jsx')
);
const Imp34599FullLadderThroughPoleViz = lazy(() =>
  import('./pages/Imp34599FullLadderThroughPoleViz.jsx')
);
const Imp34619Q3SharePlateauDpFitViz = lazy(() =>
  import('./pages/Imp34619Q3SharePlateauDpFitViz.jsx')
);
const Imp34620Q4ShareRoundoffFloorVsDpViz = lazy(() =>
  import('./pages/Imp34620Q4ShareRoundoffFloorVsDpViz.jsx')
);
const Imp34642RoundoffAmplificationExponentLadderViz = lazy(() =>
  import('./pages/Imp34642RoundoffAmplificationExponentLadderViz.jsx')
);
const Imp34667FourRungRoundoffFloorLadderViz = lazy(() =>
  import('./pages/Imp34667FourRungRoundoffFloorLadderViz.jsx')
);
const Imp34621EflowAttrSlopeContinuityViz = lazy(() =>
  import('./pages/Imp34621EflowAttrSlopeContinuityViz.jsx')
);
const Imp34622EflowAttrFpFloorSlopeDriftViz = lazy(() =>
  import('./pages/Imp34622EflowAttrFpFloorSlopeDriftViz.jsx')
);
const Imp34623DeflowResidualOneOverLogNViz = lazy(() =>
  import('./pages/Imp34623DeflowResidualOneOverLogNViz.jsx')
);
const Imp34637EflowAttrLogCurvatureCheckViz = lazy(() =>
  import('./pages/Imp34637EflowAttrLogCurvatureCheckViz.jsx')
);
const Imp34639StencilTailSpreadCrosscheckViz = lazy(() =>
  import('./pages/Imp34639StencilTailSpreadCrosscheckViz.jsx')
);
const Imp34641DeflowIdentifiabilityWindowViz = lazy(() =>
  import('./pages/Imp34641DeflowIdentifiabilityWindowViz.jsx')
);
const Imp34655LocalScalingOrderClimbViz = lazy(() =>
  import('./pages/Imp34655LocalScalingOrderClimbViz.jsx')
);
const Imp34664PoleWindowBiasVarianceViz = lazy(() =>
  import('./pages/Imp34664PoleWindowBiasVarianceViz.jsx')
);
const Imp34681PuncturedPoleWindowViz = lazy(() =>
  import('./pages/Imp34681PuncturedPoleWindowViz.jsx')
);
const Imp34656RoundoffPrefactorAmplitudeViz = lazy(() =>
  import('./pages/Imp34656RoundoffPrefactorAmplitudeViz.jsx')
);
const Imp34671TruncationSweetSpotPlateauViz = lazy(() =>
  import('./pages/Imp34671TruncationSweetSpotPlateauViz.jsx')
);
const Imp34674SharedStencilPlateauCrossvalidationViz = lazy(() =>
  import('./pages/Imp34674SharedStencilPlateauCrossvalidationViz.jsx')
);
const Imp34677BanachContractionCertificateViz = lazy(() =>
  import('./pages/Imp34677BanachContractionCertificateViz.jsx')
);
const Imp34680ThreeTermShareSpreadRoundoffValleyViz = lazy(() =>
  import('./pages/Imp34680ThreeTermShareSpreadRoundoffValleyViz.jsx')
);
const Imp34696RightWideningBanachCertificateViz = lazy(() =>
  import('./pages/Imp34696RightWideningBanachCertificateViz.jsx')
);
const Imp34697LeftEdgeContractionBoundaryViz = lazy(() =>
  import('./pages/Imp34697LeftEdgeContractionBoundaryViz.jsx')
);
const Imp34699CollapseFactorVsInverseDpKMismatchViz = lazy(() =>
  import('./pages/Imp34699CollapseFactorVsInverseDpKMismatchViz.jsx')
);
const Imp34701RawFloatWeightPlateauShiftByStencilOrderViz = lazy(() =>
  import('./pages/Imp34701RawFloatWeightPlateauShiftByStencilOrderViz.jsx')
);
const Imp34715CrossoverMarginMonotoneViz = lazy(() =>
  import('./pages/Imp34715CrossoverMarginMonotoneViz.jsx')
);
const Imp34716ResolutionMatchedCollapseLadderViz = lazy(() =>
  import('./pages/Imp34716ResolutionMatchedCollapseLadderViz.jsx')
);
const Imp34717Q3TrustBoundaryViz = lazy(() =>
  import('./pages/Imp34717Q3TrustBoundaryViz.jsx')
);
const Imp34718DerivativeCrosscheckWideGridViz = lazy(() =>
  import('./pages/Imp34718DerivativeCrosscheckWideGridViz.jsx')
);
const Imp34719SigmaExponentRampKneeViz = lazy(() =>
  import('./pages/Imp34719SigmaExponentRampKneeViz.jsx')
);
const Imp34736SigmaKneeResidualBudgetViz = lazy(() =>
  import('./pages/Imp34736SigmaKneeResidualBudgetViz.jsx')
);
const Imp34737DpStarFarTailLadderViz = lazy(() =>
  import('./pages/Imp34737DpStarFarTailLadderViz.jsx')
);
const Imp34747SecondFootingCollapseLadderViz = lazy(() =>
  import('./pages/Imp34747SecondFootingCollapseLadderViz.jsx')
);
const Imp34758DpStarProbeBandRatioViz = lazy(() =>
  import('./pages/Imp34758DpStarProbeBandRatioViz.jsx')
);
const Imp34759CrossoverGppCeilingViz = lazy(() =>
  import('./pages/Imp34759CrossoverGppCeilingViz.jsx')
);
const Imp34782DpStarFullTailEdgeRatioViz = lazy(() =>
  import('./pages/Imp34782DpStarFullTailEdgeRatioViz.jsx')
);
const Imp34783PicardItersToFloorViz = lazy(() =>
  import('./pages/Imp34783PicardItersToFloorViz.jsx')
);
const Imp34784KrawczykOutwardUlpSlackNViz = lazy(() =>
  import('./pages/Imp34784KrawczykOutwardUlpSlackNViz.jsx')
);
const Imp34761ThreeFootingCollapseLadderViz = lazy(() =>
  import('./pages/Imp34761ThreeFootingCollapseLadderViz.jsx')
);
const Imp34763CmbElasticitySigmaPeakViz = lazy(() =>
  import('./pages/Imp34763CmbElasticitySigmaPeakViz.jsx')
);
const Imp34765SigmaKneeCfElasticityViz = lazy(() =>
  import('./pages/Imp34765SigmaKneeCfElasticityViz.jsx')
);
const Imp34767FarTailTwoStencilCrossvalidationViz = lazy(() =>
  import('./pages/Imp34767FarTailTwoStencilCrossvalidationViz.jsx')
);
const Imp34779CrossoverGppCurvatureGuardViz = lazy(() =>
  import('./pages/Imp34779CrossoverGppCurvatureGuardViz.jsx')
);
const Imp34780SigmaKneeResidualDecompositionViz = lazy(() =>
  import('./pages/Imp34780SigmaKneeResidualDecompositionViz.jsx')
);
const Imp34781CollapseLadderMeanZeroEnsembleViz = lazy(() =>
  import('./pages/Imp34781CollapseLadderMeanZeroEnsembleViz.jsx')
);
const Imp34807CollapseLadderChannelSigmaComparisonViz = lazy(() =>
  import('./pages/Imp34807CollapseLadderChannelSigmaComparisonViz.jsx')
);
const Imp34808KrawczykContractionGapHeadroomViz = lazy(() =>
  import('./pages/Imp34808KrawczykContractionGapHeadroomViz.jsx')
);
const Imp34809SigmaKneeThirdOrderResidualBudgetViz = lazy(() =>
  import('./pages/Imp34809SigmaKneeThirdOrderResidualBudgetViz.jsx')
);
const Imp34810CrossoverNStencilOrderBandViz = lazy(() =>
  import('./pages/Imp34810CrossoverNStencilOrderBandViz.jsx')
);
const Imp34811KrawczykDeltaSweepKStarLadderViz = lazy(() =>
  import('./pages/Imp34811KrawczykDeltaSweepKStarLadderViz.jsx')
);
const Imp34825WindingCountLadderViz = lazy(() =>
  import('./pages/Imp34825WindingCountLadderViz.jsx')
);
const Imp34830DirectedRoundingWidthBoundViz = lazy(() =>
  import('./pages/Imp34830DirectedRoundingWidthBoundViz.jsx')
);
const Imp34832NCrossThreeWayLandmarkComparisonViz = lazy(() =>
  import('./pages/Imp34832NCrossThreeWayLandmarkComparisonViz.jsx')
);
const Imp34852CmbSweepSignFlipLadderViz = lazy(() =>
  import('./pages/Imp34852CmbSweepSignFlipLadderViz.jsx')
);
const Imp34853FifthOrderVExpansionTermLadderViz = lazy(() =>
  import('./pages/Imp34853FifthOrderVExpansionTermLadderViz.jsx')
);
const Imp34854D2LocatorConvergenceViz = lazy(() =>
  import('./pages/Imp34854D2LocatorConvergenceViz.jsx')
);
const Imp34855FiveBandShrinkRatioLadderViz = lazy(() =>
  import('./pages/Imp34855FiveBandShrinkRatioLadderViz.jsx')
);
const Imp34873SigmaKneeD3HalvingLadderViz = lazy(() =>
  import('./pages/Imp34873SigmaKneeD3HalvingLadderViz.jsx')
);
const Imp34874CmbElasticityCurvatureLadderViz = lazy(() =>
  import('./pages/Imp34874CmbElasticityCurvatureLadderViz.jsx')
);
const Imp34875IntervalCeilMarginViz = lazy(() =>
  import('./pages/Imp34875IntervalCeilMarginViz.jsx')
);
const Imp34876ShrinkRatioLimitViz = lazy(() =>
  import('./pages/Imp34876ShrinkRatioLimitViz.jsx')
);
const Imp34877CrossoverDerivativeLadderViz = lazy(() =>
  import('./pages/Imp34877CrossoverDerivativeLadderViz.jsx')
);
const Imp34890SixthDerivLadderViz = lazy(() =>
  import('./pages/Imp34890SixthDerivLadderViz.jsx')
);
const Imp34891TwoRateOffByOneViz = lazy(() =>
  import('./pages/Imp34891TwoRateOffByOneViz.jsx')
);
const Imp34892CauchyHadamardRootTestViz = lazy(() =>
  import('./pages/Imp34892CauchyHadamardRootTestViz.jsx')
);
const Imp34911ForwardBreachBandUniformityViz = lazy(() =>
  import('./pages/Imp34911ForwardBreachBandUniformityViz.jsx')
);
const Imp34912PadeBorelResummationInertnessViz = lazy(() =>
  import('./pages/Imp34912PadeBorelResummationInertnessViz.jsx')
);
const Imp34913SignedResidualOffsetInversionViz = lazy(() =>
  import('./pages/Imp34913SignedResidualOffsetInversionViz.jsx')
);
const Imp34914EflowKneeInflectionCrossingViz = lazy(() =>
  import('./pages/Imp34914EflowKneeInflectionCrossingViz.jsx')
);
const Imp34915KrawczykWorstcaseHeadroomBandViz = lazy(() =>
  import('./pages/Imp34915KrawczykWorstcaseHeadroomBandViz.jsx')
);
const Imp34916DombSykesRadiusExtrapolationViz = lazy(() =>
  import('./pages/Imp34916DombSykesRadiusExtrapolationViz.jsx')
);
const Imp34934EflowRampPositionSweepViz = lazy(() =>
  import('./pages/Imp34934EflowRampPositionSweepViz.jsx')
);
const Imp34935SigmaKneeAnalyticVsFdDerivativeViz = lazy(() =>
  import('./pages/Imp34935SigmaKneeAnalyticVsFdDerivativeViz.jsx')
);
const Imp34936SigmaKneeEpsSweepViz = lazy(() =>
  import('./pages/Imp34936SigmaKneeEpsSweepViz.jsx')
);
const Imp34937IterFloorResidualWideBandViz = lazy(() =>
  import('./pages/Imp34937IterFloorResidualWideBandViz.jsx')
);
const Imp34938LandmarkReconciliationAxisViz = lazy(() =>
  import('./pages/Imp34938LandmarkReconciliationAxisViz.jsx')
);
const Imp34939KrawczykHeadroomH2CeilingBandViz = lazy(() =>
  import('./pages/Imp34939KrawczykHeadroomH2CeilingBandViz.jsx')
);
const Imp34940OpDepthNewtonStepReconciliationViz = lazy(() =>
  import('./pages/Imp34940OpDepthNewtonStepReconciliationViz.jsx')
);
const Imp34958InflectionOffsetRunningVsFixedLadderViz = lazy(() =>
  import('./pages/Imp34958InflectionOffsetRunningVsFixedLadderViz.jsx')
);
const Imp34959SignPatternNevilleDivergenceViz = lazy(() =>
  import('./pages/Imp34959SignPatternNevilleDivergenceViz.jsx')
);
const Imp34960RawTotalCrossingViz = lazy(() =>
  import('./pages/Imp34960RawTotalCrossingViz.jsx')
);
const Imp34961BreachStepDoublingViz = lazy(() =>
  import('./pages/Imp34961BreachStepDoublingViz.jsx')
);
const Imp34962KrawczykHeadroomMonotonicityDerivativeViz = lazy(() =>
  import('./pages/Imp34962KrawczykHeadroomMonotonicityDerivativeViz.jsx')
);
const Imp34963EflowCrossingStrengthPowerLawViz = lazy(() =>
  import('./pages/Imp34963EflowCrossingStrengthPowerLawViz.jsx')
);
const Imp34964EflowPinnedProductInvarianceViz = lazy(() =>
  import('./pages/Imp34964EflowPinnedProductInvarianceViz.jsx')
);
const Imp34965ItersToFloorCeilBoundaryGeometryViz = lazy(() =>
  import('./pages/Imp34965ItersToFloorCeilBoundaryGeometryViz.jsx')
);
const Imp34978DoubleDoubleLogUlpBandWideViz = lazy(() =>
  import('./pages/Imp34978DoubleDoubleLogUlpBandWideViz.jsx')
);
const Imp34980RMarginDyadicWallSweepViz = lazy(() =>
  import('./pages/Imp34980RMarginDyadicWallSweepViz.jsx')
);
const Imp34981LandmarkGapReconstructionLadderViz = lazy(() =>
  import('./pages/Imp34981LandmarkGapReconstructionLadderViz.jsx')
);
const Imp34983SigmaKneeCrossingCmbSensitivityViz = lazy(() =>
  import('./pages/Imp34983SigmaKneeCrossingCmbSensitivityViz.jsx')
);
const Imp34985PinnedProductWindowSensitivityViz = lazy(() =>
  import('./pages/Imp34985PinnedProductWindowSensitivityViz.jsx')
);
const Imp34986CrossoverNumeratorPolynomialLadderViz = lazy(() =>
  import('./pages/Imp34986CrossoverNumeratorPolynomialLadderViz.jsx')
);
const Imp34998ConjugatePairSingularityAngleCrossCheckViz = lazy(() =>
  import('./pages/Imp34998ConjugatePairSingularityAngleCrossCheckViz.jsx')
);
const Imp34999KrawczykMarginInfimumBandEndpointViz = lazy(() =>
  import('./pages/Imp34999KrawczykMarginInfimumBandEndpointViz.jsx')
);
const Imp35000EflowCrossingStrengthExponentDecompositionViz = lazy(() =>
  import('./pages/Imp35000EflowCrossingStrengthExponentDecompositionViz.jsx')
);
const Imp35001PlusOneImpossibilityMarginBandViz = lazy(() =>
  import('./pages/Imp35001PlusOneImpossibilityMarginBandViz.jsx')
);
const Imp35018FourLandmarkClusterLogNViz = lazy(() =>
  import('./pages/Imp35018FourLandmarkClusterLogNViz.jsx')
);
const Imp35030FarTailInflectionOffsetLadderViz = lazy(() =>
  import('./pages/Imp35030FarTailInflectionOffsetLadderViz.jsx')
);
const Imp35022PinnedProductDecompositionViz = lazy(() =>
  import('./pages/Imp35022PinnedProductDecompositionViz.jsx')
);
const Imp35026SigmaDecayLandmarkLadderViz = lazy(() =>
  import('./pages/Imp35026SigmaDecayLandmarkLadderViz.jsx')
);
const Imp35077ConjugatePairDarbouxTrajectoryViz = lazy(() =>
  import('./pages/Imp35077ConjugatePairDarbouxTrajectoryViz.jsx')
);
const Imp35079CombinedInflectionOffsetLadderViz = lazy(() =>
  import('./pages/Imp35079CombinedInflectionOffsetLadderViz.jsx')
);
const Imp35080LogLogCrossingStrengthPowerLawViz = lazy(() =>
  import('./pages/Imp35080LogLogCrossingStrengthPowerLawViz.jsx')
);
const Imp35081SurplusConversionResidualWaterfallViz = lazy(() =>
  import('./pages/Imp35081SurplusConversionResidualWaterfallViz.jsx')
);
const Imp35118BernsteinSignatureLadderViz = lazy(() =>
  import('./pages/Imp35118BernsteinSignatureLadderViz.jsx')
);
const Imp35123BootstrapExponentDistributionViz = lazy(() =>
  import('./pages/Imp35123BootstrapExponentDistributionViz.jsx')
);
const Imp35138SigmaDeepTailThresholdLadderViz = lazy(() =>
  import('./pages/Imp35138SigmaDeepTailThresholdLadderViz.jsx')
);
const Imp35139EflowQeffProfileViz = lazy(() =>
  import('./pages/Imp35139EflowQeffProfileViz.jsx')
);
const Imp35140RunningGRampVsSigmoidSplitViz = lazy(() =>
  import('./pages/Imp35140RunningGRampVsSigmoidSplitViz.jsx')
);
const Imp35206HorizonFrontMismatchViz = lazy(() =>
  import('./pages/Imp35206HorizonFrontMismatchViz.jsx')
);
const Imp35207TwoWindowIncompatibilityViz = lazy(() =>
  import('./pages/Imp35207TwoWindowIncompatibilityViz.jsx')
);
const Imp35208DegLadderViz = lazy(() =>
  import('./pages/Imp35208DegLadderViz.jsx')
);
const Imp35209MarginRatioLadderViz = lazy(() =>
  import('./pages/Imp35209MarginRatioLadderViz.jsx')
);
const Imp35210FourEComponentLandmarksViz = lazy(() =>
  import('./pages/Imp35210FourEComponentLandmarksViz.jsx')
);
const Imp35231EflowFartailExponentLogNCorrectionViz = lazy(() =>
  import('./pages/Imp35231EflowFartailExponentLogNCorrectionViz.jsx')
);
const Imp35232ScheduleCorridorCollapseViz = lazy(() =>
  import('./pages/Imp35232ScheduleCorridorCollapseViz.jsx')
);
const Imp35233BetaFrontLawNUniformityViz = lazy(() =>
  import('./pages/Imp35233BetaFrontLawNUniformityViz.jsx')
);
const Imp35234RhoDeviationLogLogModulusViz = lazy(() =>
  import('./pages/Imp35234RhoDeviationLogLogModulusViz.jsx')
);
const Imp35252RealVsUnitBackgroundFieldSupContrastViz = lazy(() =>
  import('./pages/Imp35252RealVsUnitBackgroundFieldSupContrastViz.jsx')
);
const Imp35272PrefactorLadderViz = lazy(() =>
  import('./pages/Imp35272PrefactorLadderViz.jsx')
);
const Imp35273RhoRemainderStructureViz = lazy(() =>
  import('./pages/Imp35273RhoRemainderStructureViz.jsx')
);
const Imp35274EcollExponentResidualLadderViz = lazy(() =>
  import('./pages/Imp35274EcollExponentResidualLadderViz.jsx')
);
const Imp35275KrawczykHeadroomBandProfileViz = lazy(() =>
  import('./pages/Imp35275KrawczykHeadroomBandProfileViz.jsx')
);
const Imp35288R2FlowLadderSlackViz = lazy(() =>
  import('./pages/Imp35288R2FlowLadderSlackViz.jsx')
);
const Imp35293ThreeFactorInvariantRealOrdinatesViz = lazy(() =>
  import('./pages/Imp35293ThreeFactorInvariantRealOrdinatesViz.jsx')
);
const Imp35294EflowFartailResidualMonotoneViz = lazy(() =>
  import('./pages/Imp35294EflowFartailResidualMonotoneViz.jsx')
);
const Imp35295EflowFartailResidualDecompositionViz = lazy(() =>
  import('./pages/Imp35295EflowFartailResidualDecompositionViz.jsx')
);
const Imp35296MinGapStripAdvantageViz = lazy(() =>
  import('./pages/Imp35296MinGapStripAdvantageViz.jsx')
);
const Imp35308ReentryBandViz = lazy(() =>
  import('./pages/Imp35308ReentryBandViz.jsx')
);
const Imp35254EflowFartailTwoTermLawViz = lazy(() =>
  import('./pages/Imp35254EflowFartailTwoTermLawViz.jsx')
);
const Imp35183SigmaFartailExponentLadderViz = lazy(() =>
  import('./pages/Imp35183SigmaFartailExponentLadderViz.jsx')
);
const Imp35184BernsteinIngredientsTripleViz = lazy(() =>
  import('./pages/Imp35184BernsteinIngredientsTripleViz.jsx')
);
const Imp35314FidelityCertificateDiagramViz = lazy(() =>
  import('./pages/Imp35314FidelityCertificateDiagramViz.jsx')
);
const Imp35320SignLadderRoundoffCeilingViz = lazy(() =>
  import('./pages/Imp35320SignLadderRoundoffCeilingViz.jsx')
);
const Imp35329ExponentDriftClosingComparisonViz = lazy(() =>
  import('./pages/Imp35329ExponentDriftClosingComparisonViz.jsx')
);
const Imp35344FloorSensitivityCurveViz = lazy(() =>
  import('./pages/Imp35344FloorSensitivityCurveViz.jsx')
);
const Imp35345ExtrapolationGapViz = lazy(() =>
  import('./pages/Imp35345ExtrapolationGapViz.jsx')
);
const Imp35346ExpansionSlotLadderViz = lazy(() =>
  import('./pages/Imp35346ExpansionSlotLadderViz.jsx')
);
const Imp35347FixedPointContractionViz = lazy(() =>
  import('./pages/Imp35347FixedPointContractionViz.jsx')
);
const Imp35362N2000CollisionEnvelopeViz = lazy(() =>
  import('./pages/Imp35362N2000CollisionEnvelopeViz.jsx')
);
const Imp35381EflowFartailSwapFractionViz = lazy(() =>
  import('./pages/Imp35381EflowFartailSwapFractionViz.jsx')
);
const Imp35400EflowFartailTwoComponentLadderViz = lazy(() =>
  import('./pages/Imp35400EflowFartailTwoComponentLadderViz.jsx')
);
const Imp35404KrawczykHeadroomCancellationViz = lazy(() =>
  import('./pages/Imp35404KrawczykHeadroomCancellationViz.jsx')
);
const Imp35460ReentryBandLandmarkDisposalViz = lazy(() =>
  import('./pages/Imp35460ReentryBandLandmarkDisposalViz.jsx')
);
const Imp35837KrawczykCancellationRatioViz = lazy(() =>
  import('./pages/Imp35837KrawczykCancellationRatioViz.jsx')
);
const Imp35482SigmaPeakPlateauWidthSqrtScalingViz = lazy(() =>
  import('./pages/Imp35482SigmaPeakPlateauWidthSqrtScalingViz.jsx')
);
const Imp35483EflowFartailRemnantSub1e3CrossingViz = lazy(() =>
  import('./pages/Imp35483EflowFartailRemnantSub1e3CrossingViz.jsx')
);
const Imp35506EndpointPositivityMapViz = lazy(() =>
  import('./pages/Imp35506EndpointPositivityMapViz.jsx')
);
const Imp35541SchemeIndependenceViz = lazy(() =>
  import('./pages/Imp35541SchemeIndependenceViz.jsx')
);
const Imp35544SigmaThreeInputDecompositionViz = lazy(() =>
  import('./pages/Imp35544SigmaThreeInputDecompositionViz.jsx')
);
const Imp35549HeightMapDivergenceViz = lazy(() =>
  import('./pages/Imp35549HeightMapDivergenceViz.jsx')
);
const Imp35561PeakHeightMapSensitivityViz = lazy(() =>
  import('./pages/Imp35561PeakHeightMapSensitivityViz.jsx')
);
const Imp35564FartailProductDecayViz = lazy(() =>
  import('./pages/Imp35564FartailProductDecayViz.jsx')
);
const Imp35580Req4HeightGapViz = lazy(() =>
  import('./pages/Imp35580Req4HeightGapViz.jsx')
);
const Imp35771Req4HeightMultipleViz = lazy(() =>
  import('./pages/Imp35771Req4HeightMultipleViz.jsx')
);
const Imp35582ReentryBandDataUnreachabilityViz = lazy(() =>
  import('./pages/Imp35582ReentryBandDataUnreachabilityViz.jsx')
);
const Imp35587ArmAsymmetryViz = lazy(() =>
  import('./pages/Imp35587ArmAsymmetryViz.jsx')
);
const Imp35593PeakDampingViz = lazy(() =>
  import('./pages/Imp35593PeakDampingViz.jsx')
);
const Imp35597ThresholdCollapseViz = lazy(() =>
  import('./pages/Imp35597ThresholdCollapseViz.jsx')
);
const Imp35628ReqSeverityRankingViz = lazy(() =>
  import('./pages/Imp35628ReqSeverityRankingViz.jsx')
);
const Imp35663DecadeSpanGrowthViz = lazy(() =>
  import('./pages/Imp35663DecadeSpanGrowthViz.jsx')
);
const Imp35664FartailCrossingHeightMapSensitivityViz = lazy(() =>
  import('./pages/Imp35664FartailCrossingHeightMapSensitivityViz.jsx')
);
const Imp35665PinskerBridgeViz = lazy(() =>
  import('./pages/Imp35665PinskerBridgeViz.jsx')
);
const Imp35710WindingMeshCostDeltaLadderViz = lazy(() =>
  import('./pages/Imp35710WindingMeshCostDeltaLadderViz.jsx')
);
const Imp35386KempBracketingLadderViz = lazy(() =>
  import('./pages/Imp35386KempBracketingLadderViz.jsx')
);
const Imp35750BeatParityHandoffSigmaViz = lazy(() =>
  import('./pages/Imp35750BeatParityHandoffSigmaViz.jsx')
);
const Imp35772CollisionScalePrefactorPropagationViz = lazy(() =>
  import('./pages/Imp35772CollisionScalePrefactorPropagationViz.jsx')
);
const Imp35751PostportSharesSigmaViz = lazy(() =>
  import('./pages/Imp35751PostportSharesSigmaViz.jsx')
);
const Imp35975BeatParityNsigmaLadderViz = lazy(() =>
  import('./pages/Imp35975BeatParityNsigmaLadderViz.jsx')
);
const Imp35823RequiredHeightLadderViz = lazy(() =>
  import('./pages/Imp35823RequiredHeightLadderViz.jsx')
);
const Imp35824SurplusWaterfallViz = lazy(() =>
  import('./pages/Imp35824SurplusWaterfallViz.jsx')
);
const Imp35863KrawczykSplitInversionViz = lazy(() =>
  import('./pages/Imp35863KrawczykSplitInversionViz.jsx')
);
const Imp35864DebruijnDigitLadderViz = lazy(() =>
  import('./pages/Imp35864DebruijnDigitLadderViz.jsx')
);
const Imp35865SummationSchemeLadderViz = lazy(() =>
  import('./pages/Imp35865SummationSchemeLadderViz.jsx')
);
const Imp35934KappaSweepLadderViz = lazy(() =>
  import('./pages/Imp35934KappaSweepLadderViz.jsx')
);
const Imp35935AdversarialOrderingViz = lazy(() =>
  import('./pages/Imp35935AdversarialOrderingViz.jsx')
);
const Imp35936ReqHeightMultipleSigmaViz = lazy(() =>
  import('./pages/Imp35936ReqHeightMultipleSigmaViz.jsx')
);
const Imp35957RdirectFloorHeightSweepViz = lazy(() =>
  import('./pages/Imp35957RdirectFloorHeightSweepViz.jsx')
);
const Imp36025EShareStackedBarViz = lazy(() =>
  import('./pages/Imp36025EShareStackedBarViz.jsx')
);
const Imp36143EShareThresholdCrossingLadderViz = lazy(() =>
  import('./pages/Imp36143EShareThresholdCrossingLadderViz.jsx')
);
const Imp36203EShareFiveLandmarkDecayCurveViz = lazy(() =>
  import('./pages/Imp36203EShareFiveLandmarkDecayCurveViz.jsx')
);
const Imp36204KbnKahanTwoEpisodeSeparationViz = lazy(() =>
  import('./pages/Imp36204KbnKahanTwoEpisodeSeparationViz.jsx')
);
const Imp36211RouteReadinessComparisonViz = lazy(() =>
  import('./pages/Imp36211RouteReadinessComparisonViz.jsx')
);
const Imp36226ClusteredVsDefaultDepthScalingViz = lazy(() =>
  import('./pages/Imp36226ClusteredVsDefaultDepthScalingViz.jsx')
);
const Imp36227EnThreefoldImp321LadderViz = lazy(() =>
  import('./pages/Imp36227EnThreefoldImp321LadderViz.jsx')
);
const Imp36173B2TstarChecklistLadderViz = lazy(() =>
  import('./pages/Imp36173B2TstarChecklistLadderViz.jsx')
);
const Imp36192I2TruncationBlowupViz = lazy(() =>
  import('./pages/Imp36192I2TruncationBlowupViz.jsx')
);
const Imp36251KrawczykResidualOperatorFixedpointViz = lazy(() =>
  import('./pages/Imp36251KrawczykResidualOperatorFixedpointViz.jsx')
);
const Imp36267CrossoverSensitivityViz = lazy(() =>
  import('./pages/Imp36267CrossoverSensitivityViz.jsx')
);
const Imp36268PanelCountRatioViz = lazy(() =>
  import('./pages/Imp36268PanelCountRatioViz.jsx')
);
const Imp36287KbnFloorHeadroomDivergenceViz = lazy(() =>
  import('./pages/Imp36287KbnFloorHeadroomDivergenceViz.jsx')
);
const Imp36288RouteBSlopeConvergenceViz = lazy(() =>
  import('./pages/Imp36288RouteBSlopeConvergenceViz.jsx')
);
const Imp95240O5SiteCoverageMarginsViz = lazy(() =>
  import('./pages/Imp95240O5SiteCoverageMarginsViz.jsx')
);
const Imp95141YthawObligationMeterViz = lazy(() =>
  import('./pages/Imp95141YthawObligationMeterViz.jsx')
);
const Imp95266ThetaVsKPhaseCollapseViz = lazy(() =>
  import('./pages/Imp95266ThetaVsKPhaseCollapseViz.jsx')
);
const Imp95273ThetaVacuityDistributionViz = lazy(() =>
  import('./pages/Imp95273ThetaVacuityDistributionViz.jsx')
);
const Imp95265EvOctFiringCurveViz = lazy(() =>
  import('./pages/Imp95265EvOctFiringCurveViz.jsx')
);
const Imp95267OffLatticeRobustnessViz = lazy(() =>
  import('./pages/Imp95267OffLatticeRobustnessViz.jsx')
);
const Imp95268CollarOverpriceViz = lazy(() =>
  import('./pages/Imp95268CollarOverpriceViz.jsx')
);
const Imp96039HalfGramInterlacingCensusViz = lazy(() =>
  import('./pages/Imp96039HalfGramInterlacingCensusViz.jsx')
);
const Imp95143VacuitySaturationCorridorViz = lazy(() =>
  import('./pages/Imp95143VacuitySaturationCorridorViz.jsx')
);
const Imp95125AttainmentShortfallDecayViz = lazy(() =>
  import('./pages/Imp95125AttainmentShortfallDecayViz.jsx')
);
const Imp95144TierCertifierBallOpBudgetGapViz = lazy(() =>
  import('./pages/Imp95144TierCertifierBallOpBudgetGapViz.jsx')
);
const Imp95242TierCertifierBaselineVsDesignGapViz = lazy(() =>
  import('./pages/Imp95242TierCertifierBaselineVsDesignGapViz.jsx')
);
const Imp95278Window1CoverageBarViz = lazy(() =>
  import('./pages/Imp95278Window1CoverageBarViz.jsx')
);
const Imp95279PhaseCertVsNogoCeilingViz = lazy(() =>
  import('./pages/Imp95279PhaseCertVsNogoCeilingViz.jsx')
);
const Imp95282CoalLawVsLambda2Viz = lazy(() =>
  import('./pages/Imp95282CoalLawVsLambda2Viz.jsx')
);
const Imp95304PhaseAmVsPhaseCertCeilXViz = lazy(() =>
  import('./pages/Imp95304PhaseAmVsPhaseCertCeilXViz.jsx')
);
const Imp95303ConfLbVsCoalNWindowPinchViz = lazy(() =>
  import('./pages/Imp95303ConfLbVsCoalNWindowPinchViz.jsx')
);
const Imp95305SplitRzVsEvOctUnifOnsetViz = lazy(() =>
  import('./pages/Imp95305SplitRzVsEvOctUnifOnsetViz.jsx')
);
const Imp95317ConfluentBracketAcrossRViz = lazy(() =>
  import('./pages/Imp95317ConfluentBracketAcrossRViz.jsx')
);
const Imp95319SplitRzVsSplitLooCollarViz = lazy(() =>
  import('./pages/Imp95319SplitRzVsSplitLooCollarViz.jsx')
);
const Imp95349RzPenGainLadderViz = lazy(() =>
  import('./pages/Imp95349RzPenGainLadderViz.jsx')
);
const Imp95350ChartTailCapVsUniformC3nViz = lazy(() =>
  import('./pages/Imp95350ChartTailCapVsUniformC3nViz.jsx')
);
const Imp95351Unif6VsUnif5AcrossRhoViz = lazy(() =>
  import('./pages/Imp95351Unif6VsUnif5AcrossRhoViz.jsx')
);
const Imp95546RzPen78GainLadderViz = lazy(() =>
  import('./pages/Imp95546RzPen78GainLadderViz.jsx')
);
const Imp95547AlphaKhHeatScatterViz = lazy(() =>
  import('./pages/Imp95547AlphaKhHeatScatterViz.jsx')
);
const Imp95434ThetaRangeDescentOverlapGrowthViz = lazy(() =>
  import('./pages/Imp95434ThetaRangeDescentOverlapGrowthViz.jsx')
);
const Imp95607GumbelZBandViz = lazy(() =>
  import('./pages/Imp95607GumbelZBandViz.jsx')
);
const Imp95435RzpenOfflatticeDegradationLadderViz = lazy(() =>
  import('./pages/Imp95435RzpenOfflatticeDegradationLadderViz.jsx')
);
const Imp95491CombinedOfflatticeOnsetLadderViz = lazy(() =>
  import('./pages/Imp95491CombinedOfflatticeOnsetLadderViz.jsx')
);
const Imp95492BreachThresholdSurfaceViz = lazy(() =>
  import('./pages/Imp95492BreachThresholdSurfaceViz.jsx')
);
const Imp95493RstarTwoEndAccuracyViz = lazy(() =>
  import('./pages/Imp95493RstarTwoEndAccuracyViz.jsx')
);
const Imp95622SigmaExponentRampViz = lazy(() =>
  import('./pages/Imp95622SigmaExponentRampViz.jsx')
);
const Imp95623SeamGramOnsetLadderViz = lazy(() =>
  import('./pages/Imp95623SeamGramOnsetLadderViz.jsx')
);
const Imp95548PerPrimeSbarBudgetViz = lazy(() =>
  import('./pages/Imp95548PerPrimeSbarBudgetViz.jsx')
);
const Imp95624MtyVsVkCrossoverViz = lazy(() =>
  import('./pages/Imp95624MtyVsVkCrossoverViz.jsx')
);
const Imp95645KroneckerTransferConstantViz = lazy(() =>
  import('./pages/Imp95645KroneckerTransferConstantViz.jsx')
);
const Imp95646TransitionKnee2DHeatmapViz = lazy(() =>
  import('./pages/Imp95646TransitionKnee2DHeatmapViz.jsx')
);
const Imp95670PhysicalBandVsWedgeViz = lazy(() =>
  import('./pages/Imp95670PhysicalBandVsWedgeViz.jsx')
);
const Imp95647ConditionNumberViz = lazy(() =>
  import('./pages/Imp95647ConditionNumberViz.jsx')
);
const Imp95731NumberVarianceRatioViz = lazy(() =>
  import('./pages/Imp95731NumberVarianceRatioViz.jsx')
);
const Imp95752Finite80BiasHeatmapViz = lazy(() =>
  import('./pages/Imp95752Finite80BiasHeatmapViz.jsx')
);
const Imp95753CrossoverHeightWindowViz = lazy(() =>
  import('./pages/Imp95753CrossoverHeightWindowViz.jsx')
);
const Imp95828BracketClusterViz = lazy(() =>
  import('./pages/Imp95828BracketClusterViz.jsx')
);
const Imp95754CfWedgeDepthVsMultiplierViz = lazy(() =>
  import('./pages/Imp95754CfWedgeDepthVsMultiplierViz.jsx')
);
const Imp95759MsqPointwiseWallViz = lazy(() =>
  import('./pages/Imp95759MsqPointwiseWallViz.jsx')
);
const Imp95790RCapDeadZoneViz = lazy(() =>
  import('./pages/Imp95790RCapDeadZoneViz.jsx')
);
const Imp95791BiasPctVsRhoViz = lazy(() =>
  import('./pages/Imp95791BiasPctVsRhoViz.jsx')
);
const Imp95808TwinPairBiasUnionHeatmapViz = lazy(() =>
  import('./pages/Imp95808TwinPairBiasUnionHeatmapViz.jsx')
);
const Imp95809DeepCornerBiasConvergenceLadderViz = lazy(() =>
  import('./pages/Imp95809DeepCornerBiasConvergenceLadderViz.jsx')
);
const Imp95810ReachUniversalityViz = lazy(() =>
  import('./pages/Imp95810ReachUniversalityViz.jsx')
);
const Imp95792DiZigzagViz = lazy(() =>
  import('./pages/Imp95792DiZigzagViz.jsx')
);
const Imp95777DiShareAmplificationViz = lazy(() =>
  import('./pages/Imp95777DiShareAmplificationViz.jsx')
);
const Imp95868BiasN2WidomFitViz = lazy(() =>
  import('./pages/Imp95868BiasN2WidomFitViz.jsx')
);
const Imp95869TwoSidedEnvelopeViz = lazy(() =>
  import('./pages/Imp95869TwoSidedEnvelopeViz.jsx')
);
const Imp95688VkCrossoverHeightGapViz = lazy(() =>
  import('./pages/Imp95688VkCrossoverHeightGapViz.jsx')
);
const Imp95668DeficitFartailLimitViz = lazy(() =>
  import('./pages/Imp95668DeficitFartailLimitViz.jsx')
);
const Imp95681EflowInversionContourSurfaceViz = lazy(() =>
  import('./pages/Imp95681EflowInversionContourSurfaceViz.jsx')
);
const Imp95699CfBandReachabilityViz = lazy(() =>
  import('./pages/Imp95699CfBandReachabilityViz.jsx')
);
const Imp95682TwinPairBlockFloorRhoViz = lazy(() =>
  import('./pages/Imp95682TwinPairBlockFloorRhoViz.jsx')
);
const Imp95697SzegoFiniteSizeDecayViz = lazy(() =>
  import('./pages/Imp95697SzegoFiniteSizeDecayViz.jsx')
);
const Imp95549NsRigidPencilEigenvalueViz = lazy(() =>
  import('./pages/Imp95549NsRigidPencilEigenvalueViz.jsx')
);
const Imp95565AlphaOverOneMajorantMassFractionViz = lazy(() =>
  import('./pages/Imp95565AlphaOverOneMajorantMassFractionViz.jsx')
);
const Imp95566AliasEnergyInAlgebraViz = lazy(() =>
  import('./pages/Imp95566AliasEnergyInAlgebraViz.jsx')
);
const Imp95567DoublyExponentialHeightCeilingViz = lazy(() =>
  import('./pages/Imp95567DoublyExponentialHeightCeilingViz.jsx')
);
const Imp95770BarrierMollifierLengthCeilingViz = lazy(() =>
  import('./pages/Imp95770BarrierMollifierLengthCeilingViz.jsx')
);
const Imp95771Q0SignalVsConstSectorViz = lazy(() =>
  import('./pages/Imp95771Q0SignalVsConstSectorViz.jsx')
);
const Imp95776CfReffGueViz = lazy(() =>
  import('./pages/Imp95776CfReffGueViz.jsx')
);
const Imp95366RzPenOnsetDropLadderViz = lazy(() =>
  import('./pages/Imp95366RzPenOnsetDropLadderViz.jsx')
);
const Imp96075RouteMVasyuninDnLadderViz = lazy(() =>
  import('./pages/Imp96075RouteMVasyuninDnLadderViz.jsx')
);
const Imp96080RouteISymbolAnatomyViz = lazy(() =>
  import('./pages/Imp96080RouteISymbolAnatomyViz.jsx')
);
const Imp96576RouteICertifiedMinimizerWindowAnatomyViz = lazy(() =>
  import('./pages/Imp96576RouteICertifiedMinimizerWindowAnatomyViz.jsx')
);
const Imp96577RouteICertificateConstantLadderViz = lazy(() =>
  import('./pages/Imp96577RouteICertificateConstantLadderViz.jsx')
);
const Imp96581RouteILammaxRigorousVsMeasuredViz = lazy(() =>
  import('./pages/Imp96581RouteILammaxRigorousVsMeasuredViz.jsx')
);
const Imp96663RouteMCondfitLadderViz = lazy(() =>
  import('./pages/Imp96663RouteMCondfitLadderViz.jsx')
);
const Imp96670RouteMLammaxMajorantsViz = lazy(() =>
  import('./pages/Imp96670RouteMLammaxMajorantsViz.jsx')
);
const Imp96683RouteMConditioningCeilingCiViz = lazy(() =>
  import('./pages/Imp96683RouteMConditioningCeilingCiViz.jsx')
);
const Imp96701FrobeniusMajorantElevenRungViz = lazy(() =>
  import('./pages/Imp96701FrobeniusMajorantElevenRungViz.jsx')
);
const Imp96702RouteMReachProjectionViz = lazy(() =>
  import('./pages/Imp96702RouteMReachProjectionViz.jsx')
);
const Imp96777KreinLammminNTrendViz = lazy(() =>
  import('./pages/Imp96777KreinLammminNTrendViz.jsx')
);
const Imp96779RouteMCeilingLadderViz = lazy(() =>
  import('./pages/Imp96779RouteMCeilingLadderViz.jsx')
);
const Imp96801GminExponentNoiseBandViz = lazy(() =>
  import('./pages/Imp96801GminExponentNoiseBandViz.jsx')
);
const Imp96723RouteMThreeCeilingDecompositionViz = lazy(() =>
  import('./pages/Imp96723RouteMThreeCeilingDecompositionViz.jsx')
);
const Imp96640RankrPowerIterationBracketViz = lazy(() =>
  import('./pages/Imp96640RankrPowerIterationBracketViz.jsx')
);
const Imp96641GminGueEnvelopeViz = lazy(() =>
  import('./pages/Imp96641GminGueEnvelopeViz.jsx')
);
const Imp96679GminRatioSawtoothViz = lazy(() =>
  import('./pages/Imp96679GminRatioSawtoothViz.jsx')
);
const Imp96721Sigma2EmpVsGueViz = lazy(() =>
  import('./pages/Imp96721Sigma2EmpVsGueViz.jsx')
);
const Imp96646KreinCertificateMarginViz = lazy(() =>
  import('./pages/Imp96646KreinCertificateMarginViz.jsx')
);
const Imp96661KreinFtCurveViz = lazy(() =>
  import('./pages/Imp96661KreinFtCurveViz.jsx')
);
const Imp96662LammaxRankrSlopeOnsetViz = lazy(() =>
  import('./pages/Imp96662LammaxRankrSlopeOnsetViz.jsx')
);
const Imp96600BasisCFloorLadderViz = lazy(() =>
  import('./pages/Imp96600BasisCFloorLadderViz.jsx')
);
const Imp96739BasisCAboveAnchorLadderLstarCrossoverViz = lazy(() =>
  import('./pages/Imp96739BasisCAboveAnchorLadderLstarCrossoverViz.jsx')
);
const Imp96822GminLadderReachFrontierViz = lazy(() =>
  import('./pages/Imp96822GminLadderReachFrontierViz.jsx')
);
const Imp96925KreinTTruncationDeficitViz = lazy(() =>
  import('./pages/Imp96925KreinTTruncationDeficitViz.jsx')
);
const Imp97367KreinCsharpCoupledNTGridViz = lazy(() =>
  import('./pages/Imp97367KreinCsharpCoupledNTGridViz.jsx')
);
const Imp97390KreinCsharpUpperBracketsSideBySideViz = lazy(() =>
  import('./pages/Imp97390KreinCsharpUpperBracketsSideBySideViz.jsx')
);
const Imp97418KreinCsharpFloorLadderViz = lazy(() =>
  import('./pages/Imp97418KreinCsharpFloorLadderViz.jsx')
);
const Imp97452RkFloorLinearLadderViz = lazy(() =>
  import('./pages/Imp97452RkFloorLinearLadderViz.jsx')
);
const Imp97467CrossoverFractionToleranceLadderViz = lazy(() =>
  import('./pages/Imp97467CrossoverFractionToleranceLadderViz.jsx')
);
const Imp97485KreinRealizabilityGapViz = lazy(() =>
  import('./pages/Imp97485KreinRealizabilityGapViz.jsx')
);
const Imp97486Sigma2SecondMomentProfileViz = lazy(() =>
  import('./pages/Imp97486Sigma2SecondMomentProfileViz.jsx')
);
const Imp97551W1LowerFarFieldMarginViz = lazy(() =>
  import('./pages/Imp97551W1LowerFarFieldMarginViz.jsx')
);
const Imp97552E1EnvelopeDecayViz = lazy(() =>
  import('./pages/Imp97552E1EnvelopeDecayViz.jsx')
);
const Imp97553KappaDecompositionViz = lazy(() =>
  import('./pages/Imp97553KappaDecompositionViz.jsx')
);
const Imp97554B4CeilingMinBP0Viz = lazy(() =>
  import('./pages/Imp97554B4CeilingMinBP0Viz.jsx')
);
const Imp97487Bimodal1PctCrossoverViz = lazy(() =>
  import('./pages/Imp97487Bimodal1PctCrossoverViz.jsx')
);
const Imp97488KreinRoute2KbigSaturationViz = lazy(() =>
  import('./pages/Imp97488KreinRoute2KbigSaturationViz.jsx')
);
const Imp97504KreinRoute2KbigDirectFloorViz = lazy(() =>
  import('./pages/Imp97504KreinRoute2KbigDirectFloorViz.jsx')
);
const Imp97505KreinWellCaptureTradeoffViz = lazy(() =>
  import('./pages/Imp97505KreinWellCaptureTradeoffViz.jsx')
);
const Imp97550KreinRoute2LambdaFloorTraceViz = lazy(() =>
  import('./pages/Imp97550KreinRoute2LambdaFloorTraceViz.jsx')
);
const Imp97506WindowSetSurrogateDepthViz = lazy(() =>
  import('./pages/Imp97506WindowSetSurrogateDepthViz.jsx')
);
const Imp97549TwoTermLawDescentSurrogateViz = lazy(() =>
  import('./pages/Imp97549TwoTermLawDescentSurrogateViz.jsx')
);
const Imp97507KreinNscaledTgridHeatmapViz = lazy(() =>
  import('./pages/Imp97507KreinNscaledTgridHeatmapViz.jsx')
);
const Imp97508McmBasetermExtprecViz = lazy(() =>
  import('./pages/Imp97508McmBasetermExtprecViz.jsx')
);
const Imp97526NamedConcentrationToolVerdictTableViz = lazy(() =>
  import('./pages/Imp97526NamedConcentrationToolVerdictTableViz.jsx')
);
const Imp97569ConfinedWellSignMapViz = lazy(() =>
  import('./pages/Imp97569ConfinedWellSignMapViz.jsx')
);
const Imp97528KreinTailConvergedDriftViz = lazy(() =>
  import('./pages/Imp97528KreinTailConvergedDriftViz.jsx')
);
const Imp97471McmTowerPerLevelMarginViz = lazy(() =>
  import('./pages/Imp97471McmTowerPerLevelMarginViz.jsx')
);
const Imp97426PerTermOverchargeLadderViz = lazy(() =>
  import('./pages/Imp97426PerTermOverchargeLadderViz.jsx')
);
const Imp97427SigmaFartailExponentLadderViz = lazy(() =>
  import('./pages/Imp97427SigmaFartailExponentLadderViz.jsx')
);
const Imp97368W1SignProfileViz = lazy(() =>
  import('./pages/Imp97368W1SignProfileViz.jsx')
);
const Imp97369RouteBEnclosureViz = lazy(() =>
  import('./pages/Imp97369RouteBEnclosureViz.jsx')
);
const Imp96741RouteMThreeCeilingDecompositionViz = lazy(() =>
  import('./pages/Imp96741RouteMThreeCeilingDecompositionViz.jsx')
);
const Imp96742SafeDirectionSignPerRungViz = lazy(() =>
  import('./pages/Imp96742SafeDirectionSignPerRungViz.jsx')
);
const Imp96604LammaxNormalizedRatioViz = lazy(() =>
  import('./pages/Imp96604LammaxNormalizedRatioViz.jsx')
);
const Imp96621Sigma2LamminMarginLadderViz = lazy(() =>
  import('./pages/Imp96621Sigma2LamminMarginLadderViz.jsx')
);
const Imp96606CertLimitCrossoverViz = lazy(() =>
  import('./pages/Imp96606CertLimitCrossoverViz.jsx')
);
const Imp96598SineKernelLagDecayViz = lazy(() =>
  import('./pages/Imp96598SineKernelLagDecayViz.jsx')
);
const Imp96103RouteIRemainderResonanceViz = lazy(() =>
  import('./pages/Imp96103RouteIRemainderResonanceViz.jsx')
);
const Imp95371BcapTwoBranchCapVsExactRatioViz = lazy(() =>
  import('./pages/Imp95371BcapTwoBranchCapVsExactRatioViz.jsx')
);
const Imp95390RiMarginHeatmapViz = lazy(() =>
  import('./pages/Imp95390RiMarginHeatmapViz.jsx')
);
const Imp95391Split2SplitLooCrossoverViz = lazy(() =>
  import('./pages/Imp95391Split2SplitLooCrossoverViz.jsx')
);
const Imp95392PrecisionReplayCostLadderViz = lazy(() =>
  import('./pages/Imp95392PrecisionReplayCostLadderViz.jsx')
);
const Imp95409RhoStarDepthFlipViz = lazy(() =>
  import('./pages/Imp95409RhoStarDepthFlipViz.jsx')
);
const Imp95477KaratsubaCrossoverLadderViz = lazy(() =>
  import('./pages/Imp95477KaratsubaCrossoverLadderViz.jsx')
);
const Imp95393YminMapsThetaObstructedViz = lazy(() =>
  import('./pages/Imp95393YminMapsThetaObstructedViz.jsx')
);
const Imp95413EvOctOnsetSensitivityViz = lazy(() =>
  import('./pages/Imp95413EvOctOnsetSensitivityViz.jsx')
);
const Imp95469BindingChartMigrationViz = lazy(() =>
  import('./pages/Imp95469BindingChartMigrationViz.jsx')
);
const Imp95449PposEnclosureTightnessViz = lazy(() =>
  import('./pages/Imp95449PposEnclosureTightnessViz.jsx')
);
const Imp95478RaLadderInputProvenanceViz = lazy(() =>
  import('./pages/Imp95478RaLadderInputProvenanceViz.jsx')
);
const Imp95587LegBStraddleVsRatioViz = lazy(() =>
  import('./pages/Imp95587LegBStraddleVsRatioViz.jsx')
);
const Imp95588MsqGueEnvelopeViz = lazy(() =>
  import('./pages/Imp95588MsqGueEnvelopeViz.jsx')
);
const Imp95589WDecayCurvesViz = lazy(() =>
  import('./pages/Imp95589WDecayCurvesViz.jsx')
);
const Imp95737HalfRetentionScaleViz = lazy(() =>
  import('./pages/Imp95737HalfRetentionScaleViz.jsx')
);
const Imp95886DecadeReachLedgerViz = lazy(() =>
  import('./pages/Imp95886DecadeReachLedgerViz.jsx')
);
const Imp95997UfitLedgerViz = lazy(() =>
  import('./pages/Imp95997UfitLedgerViz.jsx')
);
const Imp95887SzegoDdToeplitzChainViz = lazy(() =>
  import('./pages/Imp95887SzegoDdToeplitzChainViz.jsx')
);
const Imp95888RcapWindowBottomViz = lazy(() =>
  import('./pages/Imp95888RcapWindowBottomViz.jsx')
);
const Imp95971CrossingHeightMapViz = lazy(() =>
  import('./pages/Imp95971CrossingHeightMapViz.jsx')
);
const Imp95914UfitComparisonViz = lazy(() =>
  import('./pages/Imp95914UfitComparisonViz.jsx')
);
const Imp95930C0OffsetEnvelopeViz = lazy(() =>
  import('./pages/Imp95930C0OffsetEnvelopeViz.jsx')
);
const Imp96040A0ReconcilePanelViz = lazy(() =>
  import('./pages/Imp96040A0ReconcilePanelViz.jsx')
);
const Imp96136RouteIFixedFractionPanelViz = lazy(() =>
  import('./pages/Imp96136RouteIFixedFractionPanelViz.jsx')
);
const Imp96239UshapeSlopeDriftViz = lazy(() =>
  import('./pages/Imp96239UshapeSlopeDriftViz.jsx')
);
const Imp95931Ln12DescentLadderViz = lazy(() =>
  import('./pages/Imp95931Ln12DescentLadderViz.jsx')
);
const Imp95975TierImbalanceLogLogViz = lazy(() =>
  import('./pages/Imp95975TierImbalanceLogLogViz.jsx')
);
const Imp95995VarsConstantDecompositionViz = lazy(() =>
  import('./pages/Imp95995VarsConstantDecompositionViz.jsx')
);
const Imp95993WorstAliasMarginViz = lazy(() =>
  import('./pages/Imp95993WorstAliasMarginViz.jsx')
);
const RhNovelRoutesRoadmapPage = lazy(() => import('./pages/RhNovelRoutesRoadmapPage.jsx'));
const ResearchRoutesRoadmapPage = lazy(() => import('./pages/ResearchRoutesRoadmapPage.jsx'));
const Imp96015FracBelowNullSaturationViz = lazy(() =>
  import('./pages/Imp96015FracBelowNullSaturationViz.jsx')
);
const Imp96016VarSConstantDecompositionViz = lazy(() =>
  import('./pages/Imp96016VarSConstantDecompositionViz.jsx')
);
const Imp96115BelowEnvelopeDipSignificanceTableViz = lazy(() =>
  import('./pages/Imp96115BelowEnvelopeDipSignificanceTableViz.jsx')
);
const Imp96139WindowRobustnessSweepTableViz = lazy(() =>
  import('./pages/Imp96139WindowRobustnessSweepTableViz.jsx')
);
const Imp96212TwoBranchEtruncObstructionViz = lazy(() =>
  import('./pages/Imp96212TwoBranchEtruncObstructionViz.jsx')
);
const Imp96141ExcursionDepthOffsetLedgerTableViz = lazy(() =>
  import('./pages/Imp96141ExcursionDepthOffsetLedgerTableViz.jsx')
);
const Imp96216RouteBDMarginColumnGamma1000TableViz = lazy(() =>
  import('./pages/Imp96216RouteBDMarginColumnGamma1000TableViz.jsx')
);
const Imp96199RouteBDMarginColumnGamma500TableViz = lazy(() =>
  import('./pages/Imp96199RouteBDMarginColumnGamma500TableViz.jsx')
);
const Imp96038RouteALammMinDescentViz = lazy(() =>
  import('./pages/Imp96038RouteALammMinDescentViz.jsx')
);
const Imp96120RouteMBurnolRatioDenseLadderViz = lazy(() =>
  import('./pages/Imp96120RouteMBurnolRatioDenseLadderViz.jsx')
);
const Imp96214KatoTempleUepsViz = lazy(() =>
  import('./pages/Imp96214KatoTempleUepsViz.jsx')
);
const Imp96215UshapePeakAccidentViz = lazy(() =>
  import('./pages/Imp96215UshapePeakAccidentViz.jsx')
);
const Imp96142DecorrelationSafetyMarginViz = lazy(() =>
  import('./pages/Imp96142DecorrelationSafetyMarginViz.jsx')
);
const Imp96236RouteBDMarginGamma2000ChartViz = lazy(() =>
  import('./pages/Imp96236RouteBDMarginGamma2000ChartViz.jsx')
);
const Imp96263RouteBDMarginGamma4000ChartViz = lazy(() =>
  import('./pages/Imp96263RouteBDMarginGamma4000ChartViz.jsx')
);
const Imp96237HeightToFloorViz = lazy(() =>
  import('./pages/Imp96237HeightToFloorViz.jsx')
);
const Imp96238JointLeakRegionViz = lazy(() =>
  import('./pages/Imp96238JointLeakRegionViz.jsx')
);
const Imp96256JointAnchorSweepViz = lazy(() =>
  import('./pages/Imp96256JointAnchorSweepViz.jsx')
);
const Imp96176SigmaClosedFormLadderViz = lazy(() =>
  import('./pages/Imp96176SigmaClosedFormLadderViz.jsx')
);
const Imp96160MaxAnchorWindowRobustnessViz = lazy(() =>
  import('./pages/Imp96160MaxAnchorWindowRobustnessViz.jsx')
);
const Imp96197EnDecayExponentLadderViz = lazy(() =>
  import('./pages/Imp96197EnDecayExponentLadderViz.jsx')
);
const Imp96257UshapeSlopeDriftViz = lazy(() =>
  import('./pages/Imp96257UshapeSlopeDriftViz.jsx')
);
const Imp96294EflowResidualViz = lazy(() =>
  import('./pages/Imp96294EflowResidualViz.jsx')
);
const Imp96422EflowFracLadderPeakRecoveryViz = lazy(() =>
  import('./pages/Imp96422EflowFracLadderPeakRecoveryViz.jsx')
);
const Imp96393DiscrepancyEnvelopeViz = lazy(() =>
  import('./pages/Imp96393DiscrepancyEnvelopeViz.jsx')
);
const Imp96377OffAnchorResidualViz = lazy(() =>
  import('./pages/Imp96377OffAnchorResidualViz.jsx')
);
const Imp96298PrefAtRayleighViz = lazy(() =>
  import('./pages/Imp96298PrefAtRayleighViz.jsx')
);
const Imp96299MarginFloorLooViz = lazy(() =>
  import('./pages/Imp96299MarginFloorLooViz.jsx')
);
const Imp96314CovarianceDeviationViz = lazy(() =>
  import('./pages/Imp96314CovarianceDeviationViz.jsx')
);
const Imp96316EtruncSensitivityViz = lazy(() =>
  import('./pages/Imp96316EtruncSensitivityViz.jsx')
);
const Imp96318ConfidentSpanCrossingViz = lazy(() =>
  import('./pages/Imp96318ConfidentSpanCrossingViz.jsx')
);
const Imp96262ModelSelectionScoresViz = lazy(() =>
  import('./pages/Imp96262ModelSelectionScoresViz.jsx')
);
const Imp96320RouteLReachBandViz = lazy(() =>
  import('./pages/Imp96320RouteLReachBandViz.jsx')
);
const Imp96302RouteLReachPowerLawViz = lazy(() =>
  import('./pages/Imp96302RouteLReachPowerLawViz.jsx')
);
const Imp96322EDecompositionViz = lazy(() =>
  import('./pages/Imp96322EDecompositionViz.jsx')
);
const Imp96334EcollRateChIndependenceChartViz = lazy(() =>
  import('./pages/Imp96334EcollRateChIndependenceChartViz.jsx')
);
const Imp96337MixedLadderMarginViz = lazy(() =>
  import('./pages/Imp96337MixedLadderMarginViz.jsx')
);
const Imp96338WorstExcessEvtViz = lazy(() =>
  import('./pages/Imp96338WorstExcessEvtViz.jsx')
);
const Imp96410SigmaPeakKneeCrossoverViz = lazy(() =>
  import('./pages/Imp96410SigmaPeakKneeCrossoverViz.jsx')
);
const Imp96475EtruncSensitivityViz = lazy(() =>
  import('./pages/Imp96475EtruncSensitivityViz.jsx')
);
const Imp96494SigmaKneeWidenedGridViz = lazy(() =>
  import('./pages/Imp96494SigmaKneeWidenedGridViz.jsx')
);
const Imp96497ExcursionSignificanceSensitivityViz = lazy(() =>
  import('./pages/Imp96497ExcursionSignificanceSensitivityViz.jsx')
);
const Imp96478CountGapShareViz = lazy(() =>
  import('./pages/Imp96478CountGapShareViz.jsx')
);
const Imp96560BasisCCrossoverBandNarrowingViz = lazy(() =>
  import('./pages/Imp96560BasisCCrossoverBandNarrowingViz.jsx')
);
const Imp96395SigmaLocalExponentRampViz = lazy(() =>
  import('./pages/Imp96395SigmaLocalExponentRampViz.jsx')
);
const Imp96401InterceptSeTrajectoryViz = lazy(() =>
  import('./pages/Imp96401InterceptSeTrajectoryViz.jsx')
);
const Imp96413CountModelSensitivityLadderViz = lazy(() =>
  import('./pages/Imp96413CountModelSensitivityLadderViz.jsx')
);
const Imp96378RouteMBeatPeriodOverlapViz = lazy(() =>
  import('./pages/Imp96378RouteMBeatPeriodOverlapViz.jsx')
);
const Imp96399RouteMReachRepriceViz = lazy(() =>
  import('./pages/Imp96399RouteMReachRepriceViz.jsx')
);
const Imp96438RouteMFullLadderViz = lazy(() =>
  import('./pages/Imp96438RouteMFullLadderViz.jsx')
);
const Imp96439ThreeBasisRhoCrossvalidationViz = lazy(() =>
  import('./pages/Imp96439ThreeBasisRhoCrossvalidationViz.jsx')
);
const Imp96453BasisCCorroborationCrossoverViz = lazy(() =>
  import('./pages/Imp96453BasisCCorroborationCrossoverViz.jsx')
);
const Imp96454EcollGapLadderViz = lazy(() =>
  import('./pages/Imp96454EcollGapLadderViz.jsx')
);
const Imp96455CKhSensitivityViz = lazy(() =>
  import('./pages/Imp96455CKhSensitivityViz.jsx')
);
const Imp96456VasyuninConditioningCeilingViz = lazy(() =>
  import('./pages/Imp96456VasyuninConditioningCeilingViz.jsx')
);
const Imp96514Excursion2SigmaInteriorScanViz = lazy(() =>
  import('./pages/Imp96514Excursion2SigmaInteriorScanViz.jsx')
);
const Imp96515PppCollapseViz = lazy(() =>
  import('./pages/Imp96515PppCollapseViz.jsx')
);
const Imp96516RouteMRemainderViz = lazy(() =>
  import('./pages/Imp96516RouteMRemainderViz.jsx')
);
const Imp96498SolverSpreadCountShiftCrossoverViz = lazy(() =>
  import('./pages/Imp96498SolverSpreadCountShiftCrossoverViz.jsx')
);
const Imp96520OffsetDriftLdriftPredictionViz = lazy(() =>
  import('./pages/Imp96520OffsetDriftLdriftPredictionViz.jsx')
);
const Imp96534ArEffectiveCountLadderViz = lazy(() =>
  import('./pages/Imp96534ArEffectiveCountLadderViz.jsx')
);
const Imp124840FartailPerNineLadderViz = lazy(() =>
  import('./pages/Imp124840FartailPerNineLadderViz.jsx')
);
const Imp124824EcfStencilCrossoverViz = lazy(() =>
  import('./pages/Imp124824EcfStencilCrossoverViz.jsx')
);
const Imp124882DpsInvarianceLadderViz = lazy(() =>
  import('./pages/Imp124882DpsInvarianceLadderViz.jsx')
);
const Imp124841KneeLocatorComparisonViz = lazy(() =>
  import('./pages/Imp124841KneeLocatorComparisonViz.jsx')
);
const Imp124842RoundoffLawViz = lazy(() =>
  import('./pages/Imp124842RoundoffLawViz.jsx')
);
const Imp124843KernelRatioConsumerViz = lazy(() =>
  import('./pages/Imp124843KernelRatioConsumerViz.jsx')
);
const Imp124918KernelRatioBracketViz = lazy(() =>
  import('./pages/Imp124918KernelRatioBracketViz.jsx')
);
const Imp96535LedgerReconciliationViz = lazy(() =>
  import('./pages/Imp96535LedgerReconciliationViz.jsx')
);
const Imp96554TwoExponentRelErrConeViz = lazy(() =>
  import('./pages/Imp96554TwoExponentRelErrConeViz.jsx')
);
const Imp96555RouteIConcentrationLadderViz = lazy(() =>
  import('./pages/Imp96555RouteIConcentrationLadderViz.jsx')
);
const Imp96557EflowDominationKappaViz = lazy(() =>
  import('./pages/Imp96557EflowDominationKappaViz.jsx')
);
const Imp96671SpectralShareVsMeasuredSlopeViz = lazy(() =>
  import('./pages/Imp96671SpectralShareVsMeasuredSlopeViz.jsx')
);
const Imp97040OrphanedCalibrationLeavesTabbedViz = lazy(() =>
  import('./pages/Imp97040OrphanedCalibrationLeavesTabbedViz.jsx')
);
const Imp97041NyquistAliasPeriodogramViz = lazy(() =>
  import('./pages/Imp97041NyquistAliasPeriodogramViz.jsx')
);
const Imp97082RitzVsRigorousCrossvalRangeViz = lazy(() =>
  import('./pages/Imp97082RitzVsRigorousCrossvalRangeViz.jsx')
);
const Imp97068MirrorDescentPoissonKernelViz = lazy(() =>
  import('./pages/Imp97068MirrorDescentPoissonKernelViz.jsx')
);
const Imp97652TailModelFractionBandViz = lazy(() =>
  import('./pages/Imp97652TailModelFractionBandViz.jsx')
);
const Imp97653TailBiasFloorViz = lazy(() =>
  import('./pages/Imp97653TailBiasFloorViz.jsx')
);
const Imp97654AdditivityResidualEpsSquaredCollapseViz = lazy(() =>
  import('./pages/Imp97654AdditivityResidualEpsSquaredCollapseViz.jsx')
);
const Imp97670ThreeAxisElasticityViz = lazy(() =>
  import('./pages/Imp97670ThreeAxisElasticityViz.jsx')
);
const Imp97671GapLawDecayExponentViz = lazy(() =>
  import('./pages/Imp97671GapLawDecayExponentViz.jsx')
);
const Imp97812TrA2RatioLadderViz = lazy(() =>
  import('./pages/Imp97812TrA2RatioLadderViz.jsx')
);
const Imp124815PairRatioLadderViz = lazy(() =>
  import('./pages/Imp124815PairRatioLadderViz.jsx')
);
const Imp124899KernelArmOffsetAsymmetryViz = lazy(() =>
  import('./pages/Imp124899KernelArmOffsetAsymmetryViz.jsx')
);
const Imp97715RouteMExponentRobustnessViz = lazy(() =>
  import('./pages/Imp97715RouteMExponentRobustnessViz.jsx')
);
const Imp97716WrapperElasticity5PointViz = lazy(() =>
  import('./pages/Imp97716WrapperElasticity5PointViz.jsx')
);
const Imp97745FarTailDiagnosticAsymptoteViz = lazy(() =>
  import('./pages/Imp97745FarTailDiagnosticAsymptoteViz.jsx')
);
const Imp97765FarTailCrossingHeightsViz = lazy(() =>
  import('./pages/Imp97765FarTailCrossingHeightsViz.jsx')
);
const Imp97806FullSigmaDiagnosticCurveViz = lazy(() =>
  import('./pages/Imp97806FullSigmaDiagnosticCurveViz.jsx')
);
const Imp97787FarTailDiagnosticHumpMinCrossoverViz = lazy(() =>
  import('./pages/Imp97787FarTailDiagnosticHumpMinCrossoverViz.jsx')
);
const Imp97748FoldAmplitudeLandmarkDecompositionViz = lazy(() =>
  import('./pages/Imp97748FoldAmplitudeLandmarkDecompositionViz.jsx')
);
const Imp97729FarTailResidualTwoPieceCrossoverViz = lazy(() =>
  import('./pages/Imp97729FarTailResidualTwoPieceCrossoverViz.jsx')
);
const Imp97730Diag3StencilRefineViz = lazy(() =>
  import('./pages/Imp97730Diag3StencilRefineViz.jsx')
);
const Imp124845Diag3AdditivityFlowshareViz = lazy(() =>
  import('./pages/Imp124845Diag3AdditivityFlowshareViz.jsx')
);
const Imp124880PairratioDriftSlopeScatterViz = lazy(() =>
  import('./pages/Imp124880PairratioDriftSlopeScatterViz.jsx')
);
const Imp124881FloorElasticitySidebysideViz = lazy(() =>
  import('./pages/Imp124881FloorElasticitySidebysideViz.jsx')
);
const Imp124961F2ResidualCurvatureUViz = lazy(() =>
  import('./pages/Imp124961F2ResidualCurvatureUViz.jsx')
);
const Imp124963SigmaDiagnosticClusterAnalysisPage = lazy(() =>
  import('./pages/Imp124963SigmaDiagnosticClusterAnalysisPage.jsx')
);
const Imp97732WlinResidualHalfDependenceViz = lazy(() =>
  import('./pages/Imp97732WlinResidualHalfDependenceViz.jsx')
);
const Imp97746McmDpsCapScalingViz = lazy(() =>
  import('./pages/Imp97746McmDpsCapScalingViz.jsx')
);
const Imp97747RouteMDeepLadderViz = lazy(() =>
  import('./pages/Imp97747RouteMDeepLadderViz.jsx')
);
const Imp97106PalmMirrorSurplusComparisonViz = lazy(() =>
  import('./pages/Imp97106PalmMirrorSurplusComparisonViz.jsx')
);
const Imp97111RouteMReachConfidenceLadderViz = lazy(() =>
  import('./pages/Imp97111RouteMReachConfidenceLadderViz.jsx')
);
const Imp97212RouteMResidualSignMagnitudeViz = lazy(() =>
  import('./pages/Imp97212RouteMResidualSignMagnitudeViz.jsx')
);
const Imp97213RouteMExplicitRemainderEnvelopeViz = lazy(() =>
  import('./pages/Imp97213RouteMExplicitRemainderEnvelopeViz.jsx')
);
const Imp97389RouteMSignLawOmegaLadderViz = lazy(() =>
  import('./pages/Imp97389RouteMSignLawOmegaLadderViz.jsx')
);
const Imp97453RouteMSignLawMagnitudeLadderViz = lazy(() =>
  import('./pages/Imp97453RouteMSignLawMagnitudeLadderViz.jsx')
);
const Imp97470RouteMSignLawOmega5BinetDecayViz = lazy(() =>
  import('./pages/Imp97470RouteMSignLawOmega5BinetDecayViz.jsx')
);
const Imp97409B4CeilingSignConditionOmegaClassesViz = lazy(() =>
  import('./pages/Imp97409B4CeilingSignConditionOmegaClassesViz.jsx')
);
const Imp97214RouteMFarfieldSlopebandVsOriginalViz = lazy(() =>
  import('./pages/Imp97214RouteMFarfieldSlopebandVsOriginalViz.jsx')
);
const Imp97215RouteMKappaDecompositionViz = lazy(() =>
  import('./pages/Imp97215RouteMKappaDecompositionViz.jsx')
);
const Imp97216RouteMPerClassSaturationRatioViz = lazy(() =>
  import('./pages/Imp97216RouteMPerClassSaturationRatioViz.jsx')
);
const Imp97217KreinCsharpNTCoupledDescentViz = lazy(() =>
  import('./pages/Imp97217KreinCsharpNTCoupledDescentViz.jsx')
);
const Imp97300PalmMirrorFracLadderViz = lazy(() =>
  import('./pages/Imp97300PalmMirrorFracLadderViz.jsx')
);
const Imp97301E1QuarterBSaturationViz = lazy(() =>
  import('./pages/Imp97301E1QuarterBSaturationViz.jsx')
);
const Imp97302InverseLineDiagOffdiagCoLeadingViz = lazy(() =>
  import('./pages/Imp97302InverseLineDiagOffdiagCoLeadingViz.jsx')
);
const Imp97303BesselHankelMajorantViz = lazy(() =>
  import('./pages/Imp97303BesselHankelMajorantViz.jsx')
);
const Imp97316CommittedCjkSparsityBandViz = lazy(() =>
  import('./pages/Imp97316CommittedCjkSparsityBandViz.jsx')
);
const Imp97413SigmaLadderSubdecadeKneeViz = lazy(() =>
  import('./pages/Imp97413SigmaLadderSubdecadeKneeViz.jsx')
);
const Imp97388SecondMomentDecompositionViz = lazy(() =>
  import('./pages/Imp97388SecondMomentDecompositionViz.jsx')
);
const Imp97570CrossoverCrestCombinedViz = lazy(() =>
  import('./pages/Imp97570CrossoverCrestCombinedViz.jsx')
);
const Imp97572CsharpFloorLadderViz = lazy(() =>
  import('./pages/Imp97572CsharpFloorLadderViz.jsx')
);
const Imp97587KreinFarprofileEnvelopeViz = lazy(() =>
  import('./pages/Imp97587KreinFarprofileEnvelopeViz.jsx')
);
const Imp97588McmBaseTermK0ApproachViz = lazy(() =>
  import('./pages/Imp97588McmBaseTermK0ApproachViz.jsx')
);
const Imp97612CuspSeparationViz = lazy(() =>
  import('./pages/Imp97612CuspSeparationViz.jsx')
);
const Imp97613EflowShareDecayViz = lazy(() =>
  import('./pages/Imp97613EflowShareDecayViz.jsx')
);
const Imp97614TailBiasRSweepViz = lazy(() =>
  import('./pages/Imp97614TailBiasRSweepViz.jsx')
);
const Imp97589SigmaLandmarkLadderViz = lazy(() =>
  import('./pages/Imp97589SigmaLandmarkLadderViz.jsx')
);
const Imp97627McmMarginCollapseLadderViz = lazy(() =>
  import('./pages/Imp97627McmMarginCollapseLadderViz.jsx')
);
const Imp97628McmSurrogateVsFullhOnsetViz = lazy(() =>
  import('./pages/Imp97628McmSurrogateVsFullhOnsetViz.jsx')
);
const Imp97629RealizableFractionWindowClimbViz = lazy(() =>
  import('./pages/Imp97629RealizableFractionWindowClimbViz.jsx')
);
const Imp97630Lambda2FloorSpreadWaterfallViz = lazy(() =>
  import('./pages/Imp97630Lambda2FloorSpreadWaterfallViz.jsx')
);
const Imp97631SigmaLandmarkElasticityComparisonViz = lazy(() =>
  import('./pages/Imp97631SigmaLandmarkElasticityComparisonViz.jsx')
);
const Imp97635Omega10ExtremalityMarginViz = lazy(() =>
  import('./pages/Imp97635Omega10ExtremalityMarginViz.jsx')
);
const Imp97651Tra2RatioDriftViz = lazy(() =>
  import('./pages/Imp97651Tra2RatioDriftViz.jsx')
);
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

function PageLoader() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 150);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ height: 26, width: '50%', borderRadius: 6, background: 'var(--rule)', marginBottom: 24, animation: 'pulse 1.6s ease-in-out infinite' }} />
      {[100, 88, 94].map((w, i) => (
        <div key={i} style={{ marginBottom: 12 }}>
          <div style={{ height: 13, width: w + '%', borderRadius: 4, background: 'var(--rule)', animation: 'pulse 1.6s ease-in-out infinite' }} />
        </div>
      ))}
      <div style={{ height: 13, width: '60%', borderRadius: 4, background: 'var(--rule)', marginTop: 24, animation: 'pulse 1.6s ease-in-out infinite' }} />
    </div>
  );
}

// Classic dark nav dropdown: shares behaviour (hover intent, click toggle,
// Escape, outside click, arrow keys, sectioned panel) with the editorial header.
const CLASSIC_DD_CLASSES = {
  wrap: 'nav-dropdown', btn: 'nav-dropdown-trigger', caret: 'nav-ddcaret', panel: 'nav-dropdown-menu',
  col: 'nav-ddcol', sec: 'nav-ddsec', head: 'nav-ddhead',
};

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

const KEYBOARD_SHORTCUTS = [
  { key: '1', label: 'Home', path: '/' },
  { key: '2', label: 'Lambda Bounds', path: '/lambda-bounds' },
  { key: '3', label: 'Zeta', path: '/zeta' },
  { key: '4', label: 'Route Map', path: '/route-map' },
  { key: '5', label: 'Engine Room', path: '/engine-room' },
  { key: '6', label: 'Statistics', path: '/statistics' },
  { key: '7', label: 'RH Proof State', path: '/rh-proof-state' },
  { key: '8', label: 'Improvement Queue', path: '/improvement-queue' },
  { key: '9', label: 'Open problems graph', path: '/frontier-dag' },
];

function KeyboardShortcutOverlay({ show, onClose, scope }) {
  const dialogRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!show) return undefined;
    previousFocusRef.current = document.activeElement;
    const node = dialogRef.current;
    if (node) {
      const firstFocusable = node.querySelector('button, [href], input, [tabindex]:not([tabindex="-1"])');
      (firstFocusable || node).focus();
    }
    return () => {
      const trigger = previousFocusRef.current;
      if (trigger && typeof trigger.focus === 'function') trigger.focus();
    };
  }, [show]);

  if (!show) return null;

  const handleKeyDown = (e) => {
    if (e.key !== 'Tab') return;
    const node = dialogRef.current;
    if (!node) return;
    const focusable = Array.from(
      node.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])')
    ).filter(el => !el.disabled);
    if (focusable.length === 0) { e.preventDefault(); return; }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  };

  return (
    <div
      className={scope}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.7)', display: 'flex',
        justifyContent: 'center', alignItems: 'center',
      }}
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="kbd-shortcuts-title"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        style={{
          background: 'var(--paper-2)', border: '1px solid var(--rule)',
          borderRadius: 12, padding: '28px 36px', maxWidth: 420, width: '90%',
          color: 'var(--ink)', fontFamily: 'var(--font-mono)', outline: 'none',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h3 id="kbd-shortcuts-title" style={{ margin: 0, fontSize: 18, color: 'var(--ink)' }}>Keyboard Shortcuts</h3>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', color: 'var(--ink-soft)',
              fontSize: 20, cursor: 'pointer', padding: '0 4px',
            }}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {KEYBOARD_SHORTCUTS.map(s => (
            <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <kbd style={{
                background: 'var(--paper-3)', border: '1px solid var(--rule)',
                borderRadius: 4, padding: '2px 8px', fontSize: 14,
                minWidth: 24, textAlign: 'center', color: 'var(--ink)',
              }}>{s.key}</kbd>
              <span style={{ color: 'var(--ink-soft)', fontSize: 14 }}>{s.label}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid var(--rule)', margin: '8px 0', paddingTop: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <kbd style={{
                background: 'var(--paper-3)', border: '1px solid var(--rule)',
                borderRadius: 4, padding: '2px 8px', fontSize: 14,
                minWidth: 24, textAlign: 'center', color: 'var(--ink)',
              }}>?</kbd>
              <span style={{ color: 'var(--ink-soft)', fontSize: 14 }}>Show this help</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
              <kbd style={{
                background: 'var(--paper-3)', border: '1px solid var(--rule)',
                borderRadius: 4, padding: '2px 8px', fontSize: 14,
                minWidth: 24, textAlign: 'center', color: 'var(--ink)',
              }}>Esc</kbd>
              <span style={{ color: 'var(--ink-soft)', fontSize: 14 }}>Close overlay</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Every page the command palette and document title know about: all placed nav
// links (grouped), then former nav entries and routed pages that have no nav slot.
const ALL_ROUTES = (() => {
  const seen = new Set();
  const out = [];
  const add = (r) => { if (!seen.has(r.to)) { seen.add(r.to); out.push(r); } };
  NAV_GROUPS.forEach(g => g.items.forEach(item => add({ ...item, group: g.label })));
  [...NAV_DROPPED, ...NAV_SEARCH_ONLY].forEach(d => add({ to: d.path, label: d.label, group: 'Other' }));
  return out;
})();

function DocumentTitle() {
  const { pathname } = useLocation();
  useEffect(() => {
    const match = ALL_ROUTES.find(r => r.to === pathname);
    document.title = match ? `${match.label} | exploreriemann` : 'exploreriemann — Riemann Hypothesis engine room';
  }, [pathname]);
  return null;
}

function CommandPalette({ show, onClose, navigate, scope }) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef();
  // Concept and concept-class pages come from the concepts registry, loaded the first time the
  // palette opens (dynamic import; not part of the main bundle).
  const [conceptIdx, setConceptIdx] = useState(() => getConceptIndex());
  useEffect(() => {
    if (show && !conceptIdx) loadConceptRegistry().then((idx) => { if (idx) setConceptIdx(idx); });
  }, [show, conceptIdx]);
  const conceptRoutes = useMemo(() => (conceptIdx ? [
    ...conceptIdx.registry.map((c) => ({ to: `/concept/${c.slug}`, label: c.term, group: 'Concept', keywords: c.aliases.join(' ').toLowerCase() })),
    ...conceptIdx.classes.map((k) => ({ to: `/concepts/class/${k.slug}`, label: k.name, group: 'Concept class', keywords: '' })),
  ] : []), [conceptIdx]);

  const ql = query.trim().toLowerCase();
  const matchRoute = (r) => r.label.toLowerCase().includes(ql) || r.to.toLowerCase().includes(ql) || (r.keywords && r.keywords.includes(ql));
  const results = ql === ''
    ? ALL_ROUTES.slice(0, 12)
    : (() => {
        const pages = ALL_ROUTES.filter(matchRoute).slice(0, 8);
        return [...pages, ...conceptRoutes.filter(matchRoute).slice(0, 12 - pages.length)];
      })();

  useEffect(() => {
    if (show) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current && inputRef.current.focus(), 50);
    }
  }, [show]);

  useEffect(() => { setActiveIndex(0); }, [query]);

  if (!show) return null;

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter') {
      if (results[activeIndex]) { navigate(results[activeIndex].to); onClose(); }
    } else if (e.key === 'Escape') { onClose(); }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Page navigation"
      className={scope}
      style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        background: 'rgba(0,0,0,0.75)', display: 'flex',
        justifyContent: 'center', alignItems: 'flex-start',
        paddingTop: '15vh',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--paper-2)', border: '1px solid var(--rule)',
          borderRadius: 12, width: '90%', maxWidth: 560,
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
          overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--rule)', gap: 10 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--ink-faint)', flexShrink: 0 }} aria-hidden="true">
            <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            ref={inputRef}
            role="combobox"
            aria-label="Search pages"
            aria-expanded={results.length > 0}
            aria-haspopup="listbox"
            aria-controls="cmd-palette-listbox"
            aria-activedescendant={results[activeIndex] ? `cmd-palette-option-${activeIndex}` : undefined}
            aria-autocomplete="list"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search pages and concepts..."
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              color: 'var(--ink)', fontSize: 16, fontFamily: 'var(--font-mono)',
            }}
          />
          <kbd style={{
            background: 'var(--paper-3)', border: '1px solid var(--rule)', borderRadius: 4,
            padding: '1px 6px', fontSize: 11, color: 'var(--ink-soft)', flexShrink: 0,
          }}>Esc</kbd>
        </div>
        <div
          id="cmd-palette-listbox"
          role="listbox"
          aria-label="Page results"
          style={{ maxHeight: 360, overflowY: 'auto' }}
        >
          {results.length === 0 ? (
            <div role="status" style={{ padding: '24px 16px', color: 'var(--ink-faint)', textAlign: 'center', fontSize: 14 }}>
              No pages match
            </div>
          ) : results.map((r, i) => (
            <div
              key={r.to}
              id={`cmd-palette-option-${i}`}
              role="option"
              aria-selected={i === activeIndex}
              aria-label={`${r.label} — ${r.group} — ${r.to}`}
              onClick={() => { navigate(r.to); onClose(); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 16px', cursor: 'pointer',
                background: i === activeIndex ? 'var(--paper-3)' : 'transparent',
                borderLeft: i === activeIndex ? '2px solid var(--accent)' : '2px solid transparent',
              }}
              onMouseEnter={() => setActiveIndex(i)}
            >
              <span style={{ color: 'var(--ink-faint)', fontSize: 11, fontFamily: 'var(--font-mono)', width: 118, flexShrink: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.group}</span>
              <span style={{ color: i === activeIndex ? 'var(--ink)' : 'var(--ink-soft)', fontSize: 14 }}>{r.label}</span>
              <span style={{ marginLeft: 'auto', color: 'var(--ink-faint)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>{r.to}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: '8px 16px', borderTop: '1px solid var(--rule)', display: 'flex', gap: 16, fontSize: 11, color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)' }}>
          <span>up/down navigate</span>
          <span>enter go</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}

function useKeyboardShortcuts(navigate) {
  const [showHelp, setShowHelp] = useState(false);
  const [showPalette, setShowPalette] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      // Cmd+K / Ctrl+K opens command palette from anywhere
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowPalette(prev => !prev);
        setShowHelp(false);
        return;
      }
      if (e.key === 'Escape') {
        setShowHelp(false);
        setShowPalette(false);
        return;
      }
      // Don't fire when typing in inputs
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT' || e.target.isContentEditable) return;

      if (e.key === '?') {
        setShowHelp(prev => !prev);
        return;
      }
      const shortcut = KEYBOARD_SHORTCUTS.find(s => s.key === e.key);
      if (shortcut) {
        setShowHelp(false);
        navigate(shortcut.path);
      }
    };
    const paletteHandler = () => setShowPalette(true);
    window.addEventListener('keydown', handler);
    window.addEventListener('open-command-palette', paletteHandler);
    return () => {
      window.removeEventListener('keydown', handler);
      window.removeEventListener('open-command-palette', paletteHandler);
    };
  }, [navigate]);

  return { showHelp, setShowHelp, showPalette, setShowPalette };
}

function MobileNavSection({ group, expanded, onToggle, btnRef }) {
  const location = useLocation();
  const hasActive = group.items.some(item => location.pathname === item.to);
  const bodyId = `mobile-nav-${group.label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
  return (
    <div className="nav-mobile-section">
      <button
        ref={btnRef}
        type="button"
        className={`nav-mobile-section-header${hasActive ? ' nav-mobile-section-active' : ''}`}
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={bodyId}
        aria-current={hasActive ? 'true' : undefined}
      >
        <span>{group.label}</span>
        <svg
          className={`nav-mobile-chevron${expanded ? ' nav-mobile-chevron-open' : ''}`}
          width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"
        >
          <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div id={bodyId} hidden={!expanded} className={`nav-mobile-section-items${expanded ? ' nav-mobile-section-items-open' : ''}`}>
        <div className="nav-mobile-section-inner">
          {group.sections.map(sec => (
            <div key={sec.heading} role="group" aria-label={sec.heading}>
              <div className="nav-ddhead">{sec.heading}</div>
              {sec.items.map(item => (
                <NavLink key={item.to} to={item.to} end>{item.label}</NavLink>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Classic dark top bar (shown on /classic and the 404 page). Same six groups
// and the same 1100px collapse point as the editorial header (header.css).
function NavBar({ onShowShortcuts, onShowPalette }) {
  const location = useLocation();
  const row = useDropdownRow();
  const hamburgerRef = useRef();
  const panelRef = useRef();
  const groupBtnRefs = useRef([]);
  const [expanded, setExpanded] = useState(() => new Set());
  const [menuOpen, setMenuOpen] = useMenuPanel({
    burgerRef: hamburgerRef,
    panelRef,
    onOpenFocus: () => groupBtnRefs.current[0],
  });

  const openMenu = () => {
    const cur = NAV_GROUPS.findIndex(g => g.items.some(it => it.to === location.pathname));
    setExpanded(new Set(cur >= 0 ? [cur] : []));
    setMenuOpen(true);
  };
  const toggleGroup = (i) => setExpanded(prev => {
    const n = new Set(prev);
    if (n.has(i)) n.delete(i); else n.add(i);
    return n;
  });

  // Close the narrow-width panel on a click outside the bar and panel.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const handleClick = (e) => {
      if (panelRef.current?.contains(e.target) || hamburgerRef.current?.contains(e.target)) return;
      setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen, setMenuOpen]);

  return (
    <div className="nav-bar">
      <NavLink
        to="/"
        end
        className="nav-logo"
        style={{ textDecoration: 'none' }}
        aria-label="exploreriemann home"
      >
        explore<span className="nav-logo-text">riemann</span>
      </NavLink>
      <ModeSwitch />
      <nav id="mobile-nav" ref={panelRef} aria-label="Site sections" className={`nav-links ${menuOpen ? 'nav-open' : ''}`}>
        {/* >= 1100px: grouped dropdowns */}
        <div className="nav-desktop-groups" ref={row.rowRef}>
          {NAV_GROUPS.map((group, i) => (
            <GroupDropdown
              key={group.label}
              group={group}
              idx={i}
              row={row}
              classes={CLASSIC_DD_CLASSES}
              idPrefix="nav-dd"
              showIcon={false}
            />
          ))}
        </div>
        {/* < 1100px: accordion sections inside the burger panel */}
        <div className="nav-mobile-flat">
          {NAV_GROUPS.map((group, i) => (
            <MobileNavSection
              key={group.label}
              group={group}
              expanded={expanded.has(i)}
              onToggle={() => toggleGroup(i)}
              btnRef={(el) => { groupBtnRefs.current[i] = el; }}
            />
          ))}
        </div>
      </nav>
      <button
        type="button"
        className="nav-search"
        onClick={onShowPalette}
        aria-label="Search pages"
        title="Search pages (Ctrl+K)"
      >
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span>Search</span>
      </button>
      <button
        type="button"
        className="nav-kbd"
        onClick={onShowShortcuts}
        aria-label="Keyboard shortcuts"
        title="Keyboard shortcuts (?)"
      >?</button>
      <button
        ref={hamburgerRef}
        type="button"
        className={`hamburger-btn ${menuOpen ? 'hamburger-open' : ''}`}
        onClick={() => (menuOpen ? setMenuOpen(false) : openMenu())}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        aria-controls="mobile-nav"
      >
        <span /><span /><span />
      </button>
    </div>
  );
}

function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const editorial = isEditorialRoute(location.pathname);
  // Auto-ported diagnostic viz pages: AppShell provides the cream chrome + .ed-root scope
  // (they don't render their own EditorialHeader). See isVizLegacyRoute.
  const vizLegacy = isVizLegacyRoute(location.pathname);
  const cream = editorial || vizLegacy;
  const { showHelp, setShowHelp, showPalette, setShowPalette } = useKeyboardShortcuts(navigate);
  // Match html/body/#root to the page theme so macOS/iOS overscroll shows cream, not the dark shell.
  useEffect(() => {
    const els = [document.documentElement, document.body, document.getElementById('root')].filter(Boolean);
    els.forEach((el) => { el.style.background = cream ? ED_TOKENS.paper : ''; });
  }, [cream]);

  return (
    <>
      <ScrollToTop />
      <DocumentTitle />
      <a className="skip-link" href="#main-content">Skip to content</a>
      {/* Editorial routes render their own cream in-page header (EditorialHeader). */}
      {!cream && <NavBar onShowShortcuts={() => setShowHelp(true)} onShowPalette={() => setShowPalette(true)} />}
      {/* Overlays take the cream tokens on cream routes (.ed-root scope). */}
      <KeyboardShortcutOverlay show={showHelp} onClose={() => setShowHelp(false)} scope={cream ? 'ed-root ed-overlay' : undefined} />
      <CommandPalette show={showPalette} onClose={() => setShowPalette(false)} navigate={navigate} scope={cream ? 'ed-root ed-overlay' : undefined} />
      <main
        id="main-content"
        className={
          vizLegacy
            ? 'app-content ed-active ed-root ed-viz-legacy'
            : editorial
              ? 'app-content ed-active'
              : 'app-content'
        }
      >
        {/* Auto-ported viz pages get the shared cream header injected here. */}
        {vizLegacy && <EditorialHeader />}
        <RouteErrorBoundary>
        <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePageEditorial />} />
          <Route path="/classic" element={<HomePage />} />
          <Route path="/directory" element={<DirectoryPage />} />
          <Route path="/atlas" element={<AtlasPage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/simulators" element={<SimulatorsPage />} />
          <Route path="/no-gos" element={<NoGosPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/key-results" element={<KeyResultsPage />} />
          <Route path="/threads" element={<ThreadsPage />} />
          <Route path="/state-of-field" element={<StateOfFieldPage />} />
          <Route path="/permutation-architecture" element={<PermutationArchitecturePage />} />
          <Route path="/lambda-01758354-candidate" element={<LambdaCandidate01758354Page />} />
          <Route path="/lambda-0116091" element={<LambdaQrhConditionalPage />} />
          <Route path="/lambda-qrh-conditional" element={<Navigate to="/lambda-0116091" replace />} />
          <Route path="/autonomous-fleet" element={<AutonomousFleetPage />} />
          <Route path="/critical-line-proportion" element={<CriticalLineProportionPage />} />
          <Route path="/oscillators" element={<OscillatorsPage />} />
          <Route path="/hamiltonian" element={<HamiltonianPage />} />
          <Route path="/zeta" element={<ZetaPage />} />
          <Route path="/control" element={<ControlTheoryPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/modes" element={<ModesPage />} />
          <Route path="/explorations" element={<ExplorationsPage />} />
          <Route path="/literature" element={<LiteraturePage />} />
          <Route path="/simulator" element={<SimulatorPage />} />
          <Route path="/fourier" element={<FourierPage />} />
          <Route path="/supercritical" element={<SupercriticalPage />} />
          <Route path="/debruijn-departure" element={<DeBruijnDeparturePage />} />
          <Route path="/pt-floor-audit" element={<PtFloorSensitivityAuditPage />} />
          <Route path="/route-m-cohort2-audit" element={<RouteMCohort2AuditIndexPage />} />
          <Route path="/reach-frontier-audit" element={<ReachFrontierDatasetAuditPage />} />
          <Route path="/verified-height-lever" element={<VerifiedHeightLeverPage />} />
          <Route path="/mollified-barrier-certificate" element={<MollifiedBarrierCertificatePage />} />
          <Route path="/formalization-status" element={<FormalizationStatusPage />} />
          <Route path="/formalization-review" element={<FormalizationReviewPage />} />
          <Route path="/frozen-rung-pt-equivalence" element={<FrozenRungPTEquivalencePage />} />
          <Route path="/flow-blindness-no-go" element={<FlowBlindnessNoGoPage />} />
          <Route path="/subhalf-strip-pcc-criterion" element={<SubHalfStripPccCriterionPage />} />
          <Route path="/zero-density-scoping" element={<ZeroDensityScopingPage />} />
          <Route path="/guth-maynard-scoping" element={<GuthMaynardScopingPage />} />
          <Route path="/obstruction-seam" element={<ObstructionSeamPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/waves" element={<WaveSimPage />} />
          <Route path="/rigor" element={<RHRigorPage />} />
          <Route path="/improvements" element={<ImprovementsPage />} />
          <Route path="/twistor" element={<TwistorPage />} />
          <Route path="/paper" element={<PaperPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/concepts" element={<ConceptsPage />} />
          <Route path="/concepts/class/:slug" element={<ConceptClassPage />} />
          <Route path="/concepts/class" element={<Navigate to="/concepts" replace />} />
          <Route path="/concept/:slug" element={<ConceptDetailPage />} />
          <Route path="/concept" element={<Navigate to="/concepts" replace />} />
          <Route path="/surrogate-model" element={<SurrogateModelPage />} />
          <Route path="/pascal" element={<PascalPage />} />
          <Route path="/zx-calculus" element={<ZXCalculusPage />} />
          <Route path="/rh-attack" element={<RHAttackPage />} />
          <Route path="/rh-research-modules" element={<RHResearchModulesPage />} />
          <Route path="/rh-arithmetic-theta-geometry" element={<RHResearchModulePage moduleId="arithmetic-theta-geometry" />} />
          <Route path="/rh-arithmetic-foundation" element={<RHResearchModulePage moduleId="arithmetic-foundation" />} />
          <Route path="/rh-suzuki-recurrence" element={<RHResearchModulePage moduleId="suzuki-recurrence" />} />
          <Route path="/rh-prime-memory" element={<RHResearchModulePage moduleId="prime-memory" />} />
          <Route path="/rh-finite-suzuki-certificate" element={<RHResearchModulePage moduleId="finite-suzuki-certificate" />} />
          <Route path="/rh-whole-even-certificate" element={<RHResearchModulePage moduleId="whole-even-certificate" />} />
          <Route path="/rh-spectral-denominator-repair" element={<RHResearchModulePage moduleId="spectral-denominator-repair" />} />
          <Route path="/rh-spectral-head-theory" element={<RHResearchModulePage moduleId="spectral-head-theory" />} />
          <Route path="/rh-prime-retained-tail-certificate" element={<RHResearchModulePage moduleId="prime-retained-tail-certificate" />} />
          <Route path="/rh-channel-geometry" element={<RHResearchModulePage moduleId="channel-geometry" />} />
          <Route path="/rh-historical-routes" element={<RHResearchModulePage moduleId="historical-routes" />} />
          <Route path="/rh-signed-complement" element={<RHResearchModulePage moduleId="signed-complement" />} />
          <Route path="/info-theory" element={<InformationTheoryPage />} />
          <Route path="/formal-proof" element={<FormalProofPage />} />
          <Route path="/odd-zeta" element={<OddZetaPage />} />
          <Route path="/gap-closing" element={<GapClosingPage />} />
          <Route path="/spectral-attack" element={<SpectralAttackPage />} />
          <Route path="/theta-seizing-margin" element={<ThetaSeizingMarginPage />} />
          <Route path="/theta-static-obstruction" element={<ThetaStaticObstructionPage />} />
          <Route path="/theta-basin-closure" element={<ThetaBasinClosurePage />} />
          <Route path="/theorem-b-threshold" element={<TheoremBThresholdPage />} />
          <Route path="/onset-bracket-ledger" element={<OnsetBracketLedgerPage />} />
          <Route path="/open-frontier" element={<OpenFrontierPage />} />
          <Route path="/section26-conditioning-artifact" element={<Section26ConditioningArtifactPage />} />
          <Route path="/excess-fraction-phi" element={<ExcessFractionPhiPage />} />
          <Route path="/c-shock-numerical-coincidence" element={<CShockNumericalCoincidencePage />} />
          <Route path="/viz-imp3256-vhs-crossval" element={<Imp3256CrossvalPage />} />
          <Route path="/viz-imp3252-scaled-mu" element={<Imp3252ScaledMuPage />} />
          <Route path="/viz-imp3467-closed-form-c" element={<Imp3467ClosedFormCViz />} />
          <Route path="/viz-imp3540-power-iteration-budget" element={<Imp3540PowerIterationBudgetViz />} />
          <Route path="/viz-imp3541-cosh-cancellation-margin" element={<Imp3541CoshCancellationMarginViz />} />
          <Route path="/viz-imp3542-degree-d-miss-factor" element={<Imp3542DegreeDMissFactorViz />} />
          <Route path="/viz-imp3543-xistar-robustness" element={<Imp3543XiStarRobustnessViz />} />
          <Route path="/viz-imp3563-quadrature-straddle" element={<Imp3563QuadratureStraddleViz />} />
          <Route path="/viz-imp3564-power-iteration-closed-form" element={<Imp3564PowerIterationClosedFormViz />} />
          <Route path="/viz-imp3565-sigma-postpeak-decay-exponent" element={<Imp3565SigmaPostpeakDecayExponentViz />} />
          <Route path="/viz-imp3566-cosh-sinh-margin-contrast" element={<Imp3566CoshSinhMarginContrastViz />} />
          <Route path="/viz-imp3586-sigma-crossing-logistic-drop" element={<Imp3586SigmaCrossingLogisticDropViz />} />
          <Route path="/viz-imp3567-closed-error-certificate" element={<Imp3567ClosedErrorCertificateViz />} />
          <Route path="/viz-imp3589-cosh-overestimation-factor" element={<Imp3589CoshOverestimationFactorViz />} />
          <Route path="/viz-imp3611-skew-toeplitz-krylov-gap-ladder" element={<Imp3611SkewToeplitzKrylovGapLadderViz />} />
          <Route path="/viz-imp3612-fit-bias-depth-sweep" element={<Imp3612FitBiasDepthSweepViz />} />
          <Route path="/viz-imp3629-remainder-tail-coeff-ladder" element={<Imp3629RemainderTailCoeffLadderViz />} />
          <Route path="/viz-imp3738-fmb-plateau-enclosure" element={<Imp3738FmbPlateauEnclosureViz />} />
          <Route path="/viz-imp3864-fmb-small-n-enclosure" element={<Imp3864FmbSmallNEnclosureViz />} />
          <Route path="/viz-imp3613-replica-fold-in-geometry" element={<Imp3613ReplicaFoldInGeometryViz />} />
          <Route path="/viz-imp3614-sigma-crossover-floor-invariance" element={<Imp3614SigmaCrossoverFloorInvarianceViz />} />
          <Route path="/viz-imp3627-flow-gap-nextorder" element={<Imp3627FlowGapNextorderViz />} />
          <Route path="/viz-imp3655-flow-gap-residual-ladder" element={<Imp3655FlowGapResidualLadderViz />} />
          <Route path="/viz-imp3633-twin-skew-toeplitz-gap-ladder" element={<Imp3633TwinSkewToeplitzGapLadderViz />} />
          <Route path="/viz-imp3656-triple-skew-toeplitz-gap-ladder" element={<Imp3656TripleSkewToeplitzGapLadderViz />} />
          <Route path="/viz-imp3657-sigma-crossover-tc-closedform-pin" element={<Imp3657SigmaCrossoverTcClosedformPinViz />} />
          <Route path="/viz-imp3658-planted-replica-argmax-drift" element={<Imp3658PlantedReplicaArgmaxDriftViz />} />
          <Route path="/viz-imp3695-feature-foldin-floor-ladder" element={<Imp3695FeatureFoldinFloorLadderViz />} />
          <Route path="/viz-imp96058-fejer-ceiling-floor-ladder" element={<Imp96058FejerCeilingFloorLadderViz />} />
          <Route path="/viz-imp96059-detector-reach-ladder" element={<Imp96059DetectorReachLadderViz />} />
          <Route path="/viz-imp96060-littlewood-jensen-loss" element={<Imp96060LittlewoodJensenLossViz />} />
          <Route path="/viz-imp3677-skew-toeplitz-krylov-depth-vs-N-law" element={<Imp3677SkewToeplitzKrylovDepthVsNLawViz />} />
          <Route path="/viz-imp3696-matched-pair-krylov-depth-sweep" element={<Imp3696MatchedPairKrylovDepthSweepViz />} />
          <Route path="/viz-imp3697-a-weight-decay-crosscheck" element={<Imp3697AWeightDecayCrosscheckViz />} />
          <Route path="/viz-imp3698-fifth-pair-adjacent-pairing" element={<Imp3698FifthPairAdjacentPairingViz />} />
          <Route path="/viz-imp3699-fit-bias-decay" element={<Imp3699FitBiasDecayViz />} />
          <Route path="/viz-imp3700-mesoscopic-shock-scale-separation" element={<Imp3700MesoscopicShockScaleSeparationViz />} />
          <Route path="/viz-imp3374-overflow-degree" element={<Imp3374OverflowDegreeViz />} />
          <Route path="/viz-imp3375-interloper-margin" element={<Imp3375InterloperMarginViz />} />
          <Route path="/viz-imp3376-kshell-onset-ladder" element={<Imp3376KShellOnsetLadderViz />} />
          <Route path="/viz-imp3377-rescue-budget-height-map" element={<Imp3377RescueBudgetHeightMapViz />} />
          <Route path="/viz-imp3380-path1-record-step-margin" element={<Imp3380PathOneRecordStepMarginViz />} />
          <Route path="/viz-imp3631-mfold-aliasing-threshold-ladder" element={<Imp3631MfoldAliasingThresholdLadderViz />} />
          <Route path="/viz-imp3635-flow-factor-band" element={<Imp3635FlowFactorBandViz />} />
          <Route path="/viz-imp3672-direct-dyson-flow-crosscheck" element={<Imp3672DirectDysonFlowCrosscheckViz />} />
          <Route path="/viz-imp3675-dense-lanczos-pair-spread-crossover" element={<Imp3675DenseLanczosPairSpreadCrossoverViz />} />
          <Route path="/viz-imp3678-moment-ratio-asymptotics" element={<Imp3678MomentRatioAsymptoticsViz />} />
          <Route path="/viz-imp3681-sub-floor-replica-foldin-crossover" element={<Imp3681SubFloorReplicaFoldinCrossoverViz />} />
          <Route path="/viz-imp3860-a-weight-correction-limit" element={<Imp3860AWeightCorrectionLimitViz />} />
          <Route path="/viz-imp3861-moment-ratio-decay-ladder" element={<Imp3861MomentRatioDecayLadderViz />} />
          <Route path="/viz-imp3862-saddle-ratio-crossing" element={<Imp3862SaddleRatioCrossingViz />} />
          <Route path="/viz-imp3863-gap-structure-function-s2" element={<Imp3863GapStructureFunctionViz />} />
          <Route path="/viz-imp3880-saddle-ratio-inner-converged" element={<Imp3880SaddleRatioInnerConvergedViz />} />
          <Route path="/viz-imp3881-eps-sign-change" element={<Imp3881EpsSignChangeViz />} />
          <Route path="/viz-imp3882-saddle-correction-ladder" element={<Imp3882SaddleCorrectionLadderViz />} />
          <Route path="/viz-imp3883-a-weight-simpson-climb" element={<Imp3883AWeightSimpsonClimbViz />} />
          <Route path="/viz-imp3884-thetabar-elasticity" element={<Imp3884ThetabarElasticityViz />} />
          <Route path="/viz-imp3900-h2-flux-convexity" element={<Imp3900H2FluxConvexityViz />} />
          <Route path="/viz-imp3903-smin-dmin-slack" element={<Imp3903SminDminSlackViz />} />
          <Route path="/viz-imp3904-two-solver-crossing" element={<Imp3904TwoSolverCrossingViz />} />
          <Route path="/viz-imp3906-dpsi-sensitivity" element={<Imp3906DpsiSensitivityViz />} />
          <Route path="/viz-imp3927-three-solver-crossing" element={<Imp3927ThreeSolverCrossingViz />} />
          <Route path="/viz-imp3928-inviscid-window-edge-blocksize" element={<Imp3928InviscidWindowEdgeBlocksizeViz />} />
          <Route path="/viz-imp3929-horizon-elasticity-sharpening" element={<Imp3929HorizonElasticitySharpeningViz />} />
          <Route path="/viz-imp33214-saddle-ratio-deep-tail-recovery" element={<Imp33214SaddleRatioDeepTailRecoveryViz />} />
          <Route path="/viz-imp33217-fifth-pair-spread-ulp-floor-ladder" element={<Imp33217FifthPairSpreadUlpFloorLadderViz />} />
          <Route path="/viz-imp33264-fifth-pair-spread-ladder-n2800-extended" element={<Imp33264FifthPairSpreadLadderN2800ExtendedViz />} />
          <Route path="/viz-imp33298-fifth-pair-precision-collapse" element={<Imp33298FifthPairPrecisionCollapseViz />} />
          <Route path="/viz-imp33300-majorant-overcharge-plateau-split" element={<Imp33300MajorantOverchargePlateauViz />} />
          <Route path="/viz-imp33302-sliding-start-exponent-ladder" element={<Imp33302SlidingStartExponentLadderViz />} />
          <Route path="/viz-imp33266-g6a-k4-toolkit-status-map" element={<Imp33266ToolkitStatusMapViz />} />
          <Route path="/viz-imp33267-a-weight-dual-path-tau25-30" element={<Imp33267AWeightDualPathTau25To30Viz />} />
          <Route path="/viz-imp33284-r40-inner-quadrature-ladder" element={<Imp33284R40InnerQuadratureLadderViz />} />
          <Route path="/viz-imp33304-r40-two-axis-separation" element={<Imp33304R40TwoAxisSeparationViz />} />
          <Route path="/viz-imp33285-watson-bracket-direct-vs-reform-dd-ladder" element={<Imp33285WatsonBracketDirectVsReformDdLadderViz />} />
          <Route path="/viz-imp33286-realised-vs-certified-tail-weight-ratio" element={<Imp33286RealisedVsCertifiedTailWeightRatioViz />} />
          <Route path="/viz-imp33587-band-crossing-floor-climb" element={<Imp33587BandCrossingFloorClimbViz />} />
          <Route path="/viz-imp33591-deep-tail-cross-solver-node-budget" element={<Imp33591DeepTailCrossSolverNodeBudgetViz />} />
          <Route path="/viz-imp33594-envelope-under-reference-libm" element={<Imp33594EnvelopeUnderReferenceLibmViz />} />
          <Route path="/viz-imp33607-sigma-postpeak-decay" element={<Imp33607SigmaPostpeakDecayViz />} />
          <Route path="/viz-imp33609-graded-mapped-cc-abscissa-artifact" element={<Imp33609GradedMappedCcAbscissaArtifactViz />} />
          <Route path="/viz-imp33611-band-crossing-floor-bisection" element={<Imp33611BandCrossingFloorBisectionViz />} />
          <Route path="/viz-imp33613-band-crossing-cross-solver-node-budget" element={<Imp33613BandCrossingCrossSolverNodeBudgetViz />} />
          <Route path="/viz-imp33628-etrunc-ecoll-crossover" element={<Imp33628EtruncEcollCrossoverViz />} />
          <Route path="/viz-imp35121-ecoll-etrunc-eflow-decomposition" element={<Imp35121EcollEtruncEflowDecompositionViz />} />
          <Route path="/viz-imp35161-e-component-decomposition-table" element={<Imp35161EComponentDecompositionTableViz />} />
          <Route path="/viz-imp33629-wide-range-band-crossing-envelope" element={<Imp33629WideRangeBandCrossingEnvelopeViz />} />
          <Route path="/viz-imp33656-merged-band-clearing-overview" element={<Imp33656MergedBandClearingOverviewViz />} />
          <Route path="/viz-imp33676-full-range-band-clearing-overview" element={<Imp33676FullRangeBandClearingOverviewViz />} />
          <Route path="/viz-imp33630-grade-vs-node-budget" element={<Imp33630GradeVsNodeBudgetViz />} />
          <Route path="/viz-imp33547-tilt-closure-offset-fraction" element={<Imp33547TiltClosureOffsetFractionViz />} />
          <Route path="/viz-imp33548-graded-plateau-deep-tail-node-budget" element={<Imp33548GradedPlateauDeepTailNodeBudgetViz />} />
          <Route path="/viz-imp33549-sigma-fartail-vs-interior-max" element={<Imp33549SigmaFarTailVsInteriorMaxViz />} />
          <Route path="/viz-imp33550-max-bj-realised-elasticity" element={<Imp33550MaxBjRealisedElasticityViz />} />
          <Route path="/viz-imp33570-sigma-fartail-slope-sqrt-fraction" element={<Imp33570SigmaFarTailSlopeSqrtFractionViz />} />
          <Route path="/viz-imp33571-deep-tail-jitter-envelope" element={<Imp33571DeepTailJitterEnvelopeViz />} />
          <Route path="/viz-imp33572-tau-uniform-envelope" element={<Imp33572TauUniformEnvelopeViz />} />
          <Route path="/viz-imp33573-r40-cross-solver-node-budget" element={<Imp33573R40CrossSolverNodeBudgetViz />} />
          <Route path="/viz-imp33694-inter-cluster-trough-floor" element={<Imp33694InterClusterTroughFloorViz />} />
          <Route path="/viz-imp33715-gap-vs-height-independence" element={<Imp33715GapVsHeightIndependenceViz />} />
          <Route path="/viz-imp33716-peak-minus-trough-amplitude" element={<Imp33716PeakMinusTroughAmplitudeViz />} />
          <Route path="/viz-imp33717-envelope-height-extension" element={<Imp33717EnvelopeHeightExtensionViz />} />
          <Route path="/viz-imp33718-interpeak-gap-sequence" element={<Imp33718InterPeakGapSequenceViz />} />
          <Route path="/viz-imp33742-interpeak-gap-sequence-extension" element={<Imp33742InterPeakGapSequenceExtensionViz />} />
          <Route path="/viz-imp33675-dense-node-budget-jitter" element={<Imp33675DenseNodeBudgetJitterViz />} />
          <Route path="/viz-imp33589-height-collapsing-envelope-ceiling" element={<Imp33589HeightCollapsingEnvelopeCeilingViz />} />
          <Route path="/viz-imp33595-deep-tail-cohort-index" element={<Imp33595DeepTailCohortIndexPage />} />
          <Route path="/viz-imp33617-deep-tail-cross-solver-cohort-index" element={<Imp33617DeepTailCrossSolverCohortIndexPage />} />
          <Route path="/viz-imp33219-a-weight-two-route-reproduction" element={<Imp33219AWeightTwoRouteReproductionViz />} />
          <Route path="/viz-imp33246-eps-crossval" element={<Imp33246EpsCrossvalViz />} />
          <Route path="/viz-imp33257-node-budget-full-window-ulp" element={<Imp33257NodeBudgetFullWindowUlpViz />} />
          <Route path="/viz-imp33261-saddle-window-direct-vs-log-a" element={<Imp33261SaddleWindowDirectVsLogAViz />} />
          <Route path="/viz-imp33221-model-fidelity-crossing-gap" element={<Imp33221ModelFidelityCrossingGapViz />} />
          <Route path="/viz-imp33237-eps-field-robust-transfer-modulus" element={<Imp33237EpsFieldRobustTransferModulusViz />} />
          <Route path="/viz-imp33241-watson-majorant-rho-ratio-ladder" element={<Imp33241WatsonMajorantRhoRatioLadderViz />} />
          <Route path="/viz-imp33243-recovery-rate-fit" element={<Imp33243RecoveryRateFitViz />} />
          <Route path="/viz-imp33323-min-node-lattice-jitter-band" element={<Imp33323MinNodeLatticeJitterBandViz />} />
          <Route path="/viz-imp33324-graded-vs-uniform-node-budget" element={<Imp33324GradedVsUniformNodeBudgetViz />} />
          <Route path="/viz-imp33325-far-term-tighter-majorant" element={<Imp33325FarTermTighterMajorantViz />} />
          <Route path="/viz-imp33326-genuine-eigenvector-fifth-pair-realized-c-ladder" element={<Imp33326GenuineEigenvectorFifthPairRealizedCLadderViz />} />
          <Route path="/proof-checker" element={<ProofCheckerPage />} />
          <Route path="/reasoning" element={<HistoricalReasoningPage />} />
          <Route path="/papers" element={<PapersListPage />} />
          <Route path="/paper-upload" element={<PaperUploadPage />} />
          <Route path="/twin-ladder" element={<TwinLadderPage />} />
          <Route path="/mills-theorem" element={<MillsTheoremPage />} />
          <Route path="/gilbreath" element={<GilbreathObservationPage />} />
          <Route path="/calabi-yau" element={<CalabiYauPage />} />
          <Route path="/cross-attack" element={<CrossAttackPage />} />
          <Route path="/proof-planner" element={<ProofPlannerPage />} />
          <Route path="/improvement-queue" element={<ImprovementQueuePage />} />
          <Route path="/proof-overview" element={<ProofOverviewPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/proof-explorer" element={<ProofExplorerPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/wiki" element={<WikiPage />} />
          <Route path="/index" element={<ProjectIndexPage />} />
          <Route path="/break-it" element={<BreakItPage />} />
          <Route path="/research-journal" element={<ResearchJournalPage />} />
          <Route path="/meta-acceleration" element={<MetaAccelerationPage />} />
          <Route path="/lambda-bounds" element={<LambdaBoundsPage />} />
          <Route path="/newman-lambda-01787854-candidate" element={<NewmanLambda01787854CandidatePage />} />
          <Route path="/lambda-timeline" element={<LambdaTimelinePage />} />
          <Route path="/rh-dag" element={<RhDagPage />} />
          <Route path="/frontier-dag" element={<FrontierDagPage />} />
          <Route path="/program-dag" element={<ProgramDagPage />} />
          <Route path="/rh-landscape-dag" element={<RhLandscapeDagPage />} />
          <Route path="/project-dag" element={<ProjectDagPage />} />
          <Route path="/rigor-dashboard" element={<RigorDashboardPage />} />
          <Route path="/rh-proof-state" element={<RHProofStateDashboardPage />} />
          <Route path="/what-we-know" element={<WhatWeKnowPage />} />
          <Route path="/route-b-limsup" element={<RouteBLimsupPage />} />
          <Route path="/route-map" element={<RouteMapPage />} />
          <Route path="/diagrams" element={<DiagramGalleryPage />} />
          <Route path="/catalan-signed-ladder" element={<CatalanSignedLadderPage />} />
          <Route path="/irrationality-pipeline" element={<IrrationalityPipelinePage />} />
          {/* /raymond-lambda-note RETRACTED 2026-09-22 (no redirect): the δ₀ ρ-optimization
              it presented is Sun's Catalan ledger (arXiv:2609.04176 §6–9), NOT Raymond's Λ
              paper — verified by primary-source grep of both deposits. Premise void. See
              src/data/raymond-lambda-note.js (kept as a retraction record). */}
          <Route path="/state-of-program" element={<StateOfProgramPage />} />
          <Route path="/engine-room" element={<EngineRoomPage />} />
          <Route path="/vortex-field" element={<VortexFieldPage />} />
          <Route path="/sign-switching" element={<SignSwitchingPage />} />
          <Route path="/viz-winding-dyson-flow" element={<VizWindingDysonFlowPage />} />
          <Route path="/viz-near-zero" element={<VizNearZeroPage />} />
          <Route path="/visual-geometries" element={<VisualGeometriesPage />} />
          <Route path="/prime-rigidity" element={<PrimeRigidityPage />} />
          <Route path="/viz-euler-product" element={<VizEulerProductPage />} />
          <Route path="/viz-cost-floor" element={<VizCostFloorPage />} />
          <Route path="/viz-window-landscape" element={<VizWindowLandscapePage />} />
          <Route path="/viz-freeze-flow" element={<VizFreezeFlowPage />} />
          <Route path="/dyson-verifier" element={<DysonVerifierPage />} />
          <Route path="/health" element={<HealthPage />} />
          <Route path="/full-story" element={<FullStoryPage />} />
          <Route path="/papers-download" element={<PapersDownloadPage />} />
          <Route path="/gram-points" element={<GramPointsPage />} />
          <Route path="/selberg-trace" element={<SelbergTracePage />} />
          <Route path="/rh-equivalents" element={<RHEquivalentsPage />} />
          <Route path="/three-attacks" element={<ThreeAttacksPage />} />
          <Route path="/blaschke-ghosts" element={<BlaschkeGhostsPage />} />
          <Route path="/closure-routes" element={<ClosureRoutesPage />} />
          <Route path="/kyp-bounded-real" element={<KypBoundedRealPage />} />
          <Route path="/shift-bridge-positivity" element={<ShiftBridgePositivityPage />} />
          <Route path="/freezing-bridge" element={<FreezingBridgePage />} />
          <Route path="/rigorous-numerics-stages" element={<RigorousNumericsStagesPage />} />
          <Route path="/twin-ladder-paper-roadmap" element={<TwinLadderPaperRoadmapPage />} />
          <Route path="/paper-audit-dashboard" element={<PaperAuditDashboardPage />} />
          <Route path="/pcc-route-exhaustion" element={<PCCRouteExhaustionPage />} />
          <Route path="/ht-corridor-certificates" element={<HtCorridorCertificatesPage />} />
          <Route path="/ht-window-census" element={<HtFiniteWindowPage />} />
          <Route path="/viz-hyperbolic-prime-spiral" element={<VizHyperbolicPrimeSpiralPage />} />
          <Route path="/hidden-square-program" element={<HiddenSquareProgramPage />} />
          <Route path="/reciprocal-program" element={<ReciprocalProgramPage />} />
          <Route path="/viz-log-phase-spiral" element={<VizLogPhaseSpiralPage />} />
          <Route path="/viz-euler-transport-flow" element={<VizEulerTransportFlowPage />} />
          <Route path="/hardy-z" element={<HardyZPage />} />
          <Route path="/viz-volterra-kernel-heatmap" element={<VolterraKernelHeatmapPage />} />
          <Route path="/viz-volterra-norm-curve" element={<VolterraNormCurvePage />} />
          <Route path="/volterra-bound" element={<VolterraBoundPage />} />
          <Route path="/schatten-trace-norm" element={<SchattenTraceNormPage />} />
          <Route path="/collapse-chain" element={<CollapseChainPage />} />
          <Route path="/cayley-schur-trajectory" element={<CayleySchurTrajectoryPage />} />
          <Route path="/viz-twin-ladder-tomography" element={<VizTwinLadderTomographyPage />} />
          <Route path="/viz-prime-caustic" element={<VizPrimeCausticPage />} />
          <Route path="/viz-prime-density-caustic" element={<VizPrimeDensityOnCausticPage />} />
          <Route path="/viz-caustic-resonance" element={<VizCausticResonancePage />} />
          <Route path="/viz-phase-cylinder" element={<VizPhaseCylinderPage />} />
          <Route path="/viz-twistor-dual-intertwiner" element={<VizTwistorDualIntertwinerPage />} />
          <Route path="/viz-unwrapped-rays" element={<VizUnwrappedRaysPage />} />
          <Route path="/zoom-hierarchy" element={<VizZoomHierarchyPage />} />
          <Route path="/angular-spacing-stats" element={<AngularSpacingStatsPage />} />
          <Route path="/viz-prime-phase-crystal" element={<VizPrimePhaseCrystalPage />} />
          <Route path="/visualizations" element={<VisualizationsIndexPage />} />
          <Route path="/animations" element={<AnimationsPage />} />
          <Route path="/berry-keating-xp" element={<BerryKeatingXpPage />} />
          <Route path="/connes-adelic" element={<ConnesAdelicPage />} />
          <Route path="/edge-rigidity" element={<EdgeRigidityPage />} />
          <Route path="/esy-rigidity-empirical" element={<EsyRigidityEmpiricalPage />} />
          <Route path="/gue-comparison" element={<GueComparisonPage />} />
          <Route path="/lmfdb-cross-reference" element={<LmfdbCrossReferencePage />} />
          <Route path="/pair-correlation" element={<PairCorrelationPage />} />
          <Route path="/riemann-siegel-z" element={<RiemannSiegelZPage />} />
          <Route path="/voronin-universality" element={<VoroninUniversalityPage />} />
          <Route path="/viz-imp33830-sigma-decay-landmark-ladder" element={<Imp33830SigmaDecayLandmarkLadderViz />} />
          <Route path="/viz-imp33831-eflow-resid-ratio-ladder" element={<Imp33831EflowResidRatioLadderViz />} />
          <Route path="/viz-imp33832-saturation-curvature-hump-vs-k" element={<Imp33832SaturationCurvatureHumpVsKViz />} />
          <Route path="/viz-imp33833-decoupled-rate-heatmap" element={<Imp33833DecoupledRateHeatmapViz />} />
          <Route path="/viz-imp33731-sigma-ramp-curvature" element={<Imp33731SigmaRampCurvatureViz />} />
          <Route path="/viz-imp33677-cluster-peak-gap-sequence" element={<Imp33677ClusterPeakGapSequenceViz />} />
          <Route path="/viz-imp33864-cren-gap-onset-ladder" element={<Imp33864CrenGapOnsetLadderViz />} />
          <Route path="/viz-imp33894-residual-shape" element={<Imp33894ResidualShapeViz />} />
          <Route path="/viz-imp33895-log-saturation-reconciliation" element={<Imp33895LogSaturationReconciliationViz />} />
          <Route path="/viz-imp33738-gap-vs-trough-depth-coupling" element={<Imp33738GapVsTroughDepthCouplingViz />} />
          <Route path="/viz-imp33800-sigma-inflection-residual-contrast" element={<Imp33800SigmaInflectionResidualContrastViz />} />
          <Route path="/viz-imp33930-crossover-fixed-point-convergence" element={<Imp33930CrossoverFixedPointConvergenceViz />} />
          <Route path="/viz-imp33931-fartail-floor-sensitivity-scatter" element={<Imp33931FartailFloorSensitivityScatterViz />} />
          <Route path="/viz-imp33932-subdecade-exponent-ramp-curvature" element={<Imp33932SubdecadeExponentRampCurvatureViz />} />
          <Route path="/viz-imp33950-perron-norm-curve" element={<Imp33950PerronNormCurveViz />} />
          <Route path="/viz-imp33993-g-vs-law-offset" element={<Imp33993GVsLawOffsetViz />} />
          <Route path="/viz-imp33994-sawtooth-gap-vs-step" element={<Imp33994SawtoothGapVsStepViz />} />
          <Route path="/viz-imp33999-residual-curvature-contrast" element={<Imp33999ResidualCurvatureContrastViz />} />
          <Route path="/viz-imp33915-endpoint-artifact-residual-migration" element={<Imp33915EndpointArtifactResidualMigrationViz />} />
          <Route path="/viz-imp34032-winding-slope-vs-alpha" element={<Imp34032WindingSlopeVsAlphaViz />} />
          <Route path="/viz-imp34033-f1-widening-drift" element={<Imp34033F1WideningDriftViz />} />
          <Route path="/viz-imp34037-realness-residual-vs-theta" element={<Imp34037RealnessResidualVsThetaViz />} />
          <Route path="/viz-imp33953-resid-exp-hump-argmax-crossover" element={<Imp33953ResidExpHumpArgmaxCrossoverViz />} />
          <Route path="/viz-imp34049-fixed-band-drift-growth" element={<Imp34049FixedBandDriftGrowthViz />} />
          <Route path="/viz-imp34118-sawtooth-phase-realignment-schedule" element={<Imp34118SawtoothPhaseRealignmentScheduleViz />} />
          <Route path="/viz-imp34050-endpoint-peak-model-tournament" element={<Imp34050EndpointPeakModelTournamentViz />} />
          <Route path="/viz-imp34051-loo-evidence-ratio-strip" element={<Imp34051LooEvidenceRatioStripViz />} />
          <Route path="/viz-imp34052-f3-landmark-spread" element={<Imp34052F3LandmarkThreeWaySpreadViz />} />
          <Route path="/viz-imp34014-endpoint-peak-model-selection-fit" element={<Imp34014EndpointPeakModelSelectionFitViz />} />
          <Route path="/viz-imp34098-endpoint-trough-migration" element={<Imp34098EndpointTroughMigrationViz />} />
          <Route path="/viz-imp34015-f2-magshare-drift" element={<Imp34015F2MagShareDriftViz />} />
          <Route path="/viz-imp34016-sigma-exponent-vs-logt0" element={<Imp34016SigmaExponentVsLogT0Viz />} />
          <Route path="/viz-imp34099-aggregate-share-window-sensitivity" element={<Imp34099AggregateShareWindowSensitivityViz />} />
          <Route path="/viz-imp34100-apex-parabola-wing-fidelity" element={<Imp34100ApexParabolaWingFidelityViz />} />
          <Route path="/viz-imp34101-serial-dependence-test-panel" element={<Imp34101SerialDependenceTestPanelViz />} />
          <Route path="/viz-imp34119-phase-zero-branch-geometry" element={<Imp34119PhaseZeroBranchGeometryViz />} />
          <Route path="/viz-imp34185-outer-branch-angle-family" element={<Imp34185OuterBranchAngleFamilyViz />} />
          <Route path="/viz-imp34120-endpoint-peak-saturating-tournament" element={<Imp34120EndpointPeakSaturatingTournamentViz />} />
          <Route path="/viz-imp34078-pointwise-vs-window-exponent" element={<Imp34078PointwiseVsWindowExponentViz />} />
          <Route path="/viz-imp34142-window-anchor-centroid" element={<Imp34142WindowAnchorCentroidViz />} />
          <Route path="/viz-imp34156-asymmetric-trim-attribution" element={<Imp34156AsymmetricTrimAttributionViz />} />
          <Route path="/viz-imp34182-deep-ladder-precision-floor" element={<Imp34182DeepLadderPrecisionFloorViz />} />
          <Route path="/viz-imp34157-trough-peak-ratio-creep" element={<Imp34157TroughPeakRatioCreepViz />} />
          <Route path="/viz-imp34158-digit-loss-cliff" element={<Imp34158DigitLossCliffViz />} />
          <Route path="/viz-imp34159-cubic-tilt-wing-reconstruction" element={<Imp34159CubicTiltWingReconstructionViz />} />
          <Route path="/viz-imp34198-ecoll-residual-milestone-ladder" element={<Imp34198EcollResidualMilestoneLadderViz />} />
          <Route path="/viz-imp34077-geometric-center-taylor-reduction" element={<Imp34077GeometricCenterTaylorReductionViz />} />
          <Route path="/viz-imp34200-lto-per-pair-influence-bar-chart" element={<Imp34200LtoPerPairInfluenceBarChartViz />} />
          <Route path="/viz-imp34203-endpoint-vs-fixed-band-peak-saturation-cross" element={<Imp34203EndpointVsFixedBandPeakSaturationCrossViz />} />
          <Route path="/viz-imp34205-widening-slope-drift-convergence" element={<Imp34205WideningSlopeConvergenceViz />} />
          <Route path="/viz-imp34221-eflow-etrunc-ratio-decay-onset" element={<Imp34221EflowEtruncRatioDecayOnsetViz />} />
          <Route path="/viz-imp34237-fixed-band-peak-reaccel-and-surrogate-pole" element={<Imp34237FixedBandPeakReaccelAndSurrogatePoleViz />} />
          <Route path="/viz-imp34238-seven-crossings-onset-ladder" element={<Imp34238SevenCrossingsOnsetLadderViz />} />
          <Route path="/viz-imp34244-kpss-l0-flip-shift-ranking" element={<Imp34244KpssL0FlipShiftRankingViz />} />
          <Route path="/viz-imp34255-m2-ceiling-window-width-divergence" element={<Imp34255M2CeilingWindowWidthDivergenceViz />} />
          <Route path="/viz-imp34259-unified-endpoint-distance-family" element={<Imp34259UnifiedEndpointDistanceFamilyViz />} />
          <Route path="/viz-imp34274-fixed-band-peak-increment-minimum" element={<Imp34274FixedBandPeakIncrementMinimumViz />} />
          <Route path="/viz-imp34268-fixed-band-peak-reaccel-convexity-stitch" element={<Imp34268FixedBandPeakReaccelConvexityStitchViz />} />
          <Route path="/viz-imp34281-m2-ceiling-cohort-index" element={<Imp34281M2CeilingCohortIndexPage />} />
          <Route path="/viz-imp34356-m2-ceiling-exactfit-coeff-ladder" element={<Imp34356M2CeilingExactFitCoeffLadderViz />} />
          <Route path="/viz-imp34269-fixed-band-peak-shared-grid-cross-recompute" element={<Imp34269FixedBandPeakSharedGridCrossRecomputeViz />} />
          <Route path="/viz-imp34352-eflow-gronwall-crossover-offset" element={<Imp34352EflowGronwallCrossoverOffsetViz />} />
          <Route path="/viz-imp34353-crossover-surplus-family-decay" element={<Imp34353CrossoverSurplusFamilyDecayViz />} />
          <Route path="/viz-imp34354-crossover-surplus-small-thr-factorisation" element={<Imp34354CrossoverSurplusSmallThrFactorisationViz />} />
          <Route path="/viz-imp34416-crossover-surplus-fartail-composite-limit" element={<Imp34416CrossoverSurplusFartailCompositeLimitViz />} />
          <Route path="/viz-imp34355-fartail-crossover-residual-collapse" element={<Imp34355FarTailCrossoverResidualCollapseViz />} />
          <Route path="/viz-imp34456-coupling-ratio-drift-ladder" element={<Imp34456CouplingRatioDriftLadderViz />} />
          <Route path="/viz-imp34457-residue-curvature-corrected" element={<Imp34457ResidueCurvatureCorrectedViz />} />
          <Route path="/viz-imp34458-deflow-falloff" element={<Imp34458DeflowFalloffViz />} />
          <Route path="/viz-imp34459-peak-relocation-regime-width" element={<Imp34459PeakRelocationRegimeWidthViz />} />
          <Route path="/viz-imp34460-two-term-curvature-crossval" element={<Imp34460TwoTermCurvatureCrossvalViz />} />
          <Route path="/viz-imp34514-coupling-ratio-1overlogT0-fit" element={<Imp34514CouplingRatio1overLogT0FitViz />} />
          <Route path="/viz-imp34515-surplus-amplitude-relDef-convergence" element={<Imp34515SurplusAmplitudeRelDefConvergenceViz />} />
          <Route path="/viz-imp34516-pole-leakage-ladder" element={<Imp34516PoleLeakageLadderViz />} />
          <Route path="/viz-imp34517-numerator-approach-a-stability" element={<Imp34517NumeratorApproachAStabilityViz />} />
          <Route path="/viz-imp34522-conditionality-gap-landmarks" element={<Imp34522ConditionalityGapLandmarksViz />} />
          <Route path="/viz-imp34562-deep-rung-doubling-map-landmarks" element={<Imp34562DeepRungDoublingMapLandmarksViz />} />
          <Route path="/viz-imp34534-pole-leakage-single-pole-fit" element={<Imp34534PoleLeakageSinglePoleFitViz />} />
          <Route path="/viz-imp34535-drift-residual-vs-step-size" element={<Imp34535DriftResidualVsStepSizeViz />} />
          <Route path="/viz-imp34542-crossover-exponent-vs-logT0" element={<Imp34542CrossoverExponentVsLogT0Viz />} />
          <Route path="/viz-imp34361-eflow-crossover-offset-cohort-index" element={<Imp34361EflowCrossoverOffsetCohortIndexPage />} />
          <Route path="/viz-imp34377-resid-exp-pole-cohort-index" element={<Imp34377ResidExpPoleCohortIndexPage />} />
          <Route path="/viz-imp34378-trough-peak-ratio-ceiling" element={<Imp34378TroughPeakRatioCeilingViz />} />
          <Route path="/viz-imp34383-d2-signchange-grid" element={<Imp34383D2SignChangeGridViz />} />
          <Route path="/viz-imp34417-sigma-vs-product-gap-complement" element={<Imp34417SigmaVsProductGapComplementViz />} />
          <Route path="/viz-imp34418-widening-residual-prepole-reversal" element={<Imp34418WideningResidualPrepoleReversalViz />} />
          <Route path="/viz-imp34419-widening-slope-minus-one-crossing" element={<Imp34419WideningSlopeMinusOneCrossingViz />} />
          <Route path="/viz-imp34438-eflow-ratio-r-exponent-ladder" element={<Imp34438EflowRatioRExponentLadderViz />} />
          <Route path="/viz-imp34439-third-diff-pole-order" element={<Imp34439ThirdDiffPoleOrderViz />} />
          <Route path="/viz-imp34475-four-locator-cluster-axis" element={<Imp34475FourLocatorClusterAxisViz />} />
          <Route path="/viz-imp34494-residue-error-bar" element={<Imp34494ResidueErrorBarViz />} />
          <Route path="/viz-imp34495-deflow-decay" element={<Imp34495DeflowDecayViz />} />
          <Route path="/viz-imp34496-excess-above-two" element={<Imp34496ExcessAboveTwoViz />} />
          <Route path="/viz-imp34497-crossover-en-assembly" element={<Imp34497CrossoverEnAssemblyViz />} />
          <Route path="/viz-imp34498-en-monotone-descent" element={<Imp34498EnMonotoneDescentViz />} />
          <Route path="/viz-imp34499-bridge-slope-three-rung" element={<Imp34499BridgeSlopeThreeRungViz />} />
          <Route
            path="/viz-imp34540-pole-leakage-five-rung-ladder"
            element={<Imp34540PoleLeakageFiveRungLadderViz />}
          />
          <Route
            path="/viz-imp34476-sigma-product-gap-ratio-approach"
            element={<Imp34476SigmaProductGapRatioApproachViz />}
          />
          <Route path="/viz-imp34477-widening-slope-pole-leakage" element={<Imp34477WideningSlopePoleLeakageViz />} />
          <Route
            path="/viz-imp34478-widening-slope-prepole-landmark-decade-axis"
            element={<Imp34478WideningSlopePrepoleLandmarkDecadeAxisViz />}
          />
          <Route
            path="/viz-imp33851-hump-envelope-symmetry-vs-k"
            element={<Imp33851HumpEnvelopeSymmetryVsKViz />}
          />
          <Route
            path="/viz-imp34528-tailside-hump-decay-vs-sqrt-n-fartail"
            element={<Imp34528TailsideHumpDecayVsSqrtNFartailViz />}
          />
          <Route
            path="/viz-imp34530-pole-leakage-spacing-compression-fit"
            element={<Imp34530PoleLeakageSpacingCompressionFitViz />}
          />
          <Route
            path="/viz-imp34529-recovered-pole-convergence"
            element={<Imp34529RecoveredPoleConvergenceViz />}
          />
          <Route
            path="/viz-imp34557-hump-skew-mirror-j5"
            element={<Imp34557HumpSkewMirrorViz />}
          />
          <Route
            path="/viz-imp34574-local-spacing-exponent-descent"
            element={<Imp34574LocalSpacingExponentDescentViz />}
          />
          <Route
            path="/viz-imp34575-near-pole-resolvability-floors"
            element={<Imp34575NearPoleResolvabilityFloorsViz />}
          />
          <Route
            path="/viz-imp34551-deep-rung-argmax-jitter"
            element={<Imp34551DeepRungArgmaxJitterViz />}
          />
          <Route
            path="/viz-imp34594-eflow-attr-far-side-smoothness-ladder"
            element={<Imp34594EflowAttrFarSideSmoothnessLadderViz />}
          />
          <Route
            path="/viz-imp34570-eflow-attr-power-law-fit"
            element={<Imp34570EflowAttrPowerLawFitViz />}
          />
          <Route
            path="/viz-imp34596-deflow-observed-exponent"
            element={<Imp34596DeflowObservedExponentViz />}
          />
          <Route
            path="/viz-imp34597-drift-share-regime-split"
            element={<Imp34597DriftShareRegimeSplitViz />}
          />
          <Route
            path="/viz-imp34598-binary128-cross-check"
            element={<Imp34598Binary128CrossCheckViz />}
          />
          <Route
            path="/viz-imp34599-full-ladder-through-pole"
            element={<Imp34599FullLadderThroughPoleViz />}
          />
          <Route
            path="/viz-imp34619-q3-share-plateau-dp-fit"
            element={<Imp34619Q3SharePlateauDpFitViz />}
          />
          <Route
            path="/viz-imp34620-q4-share-roundoff-floor-vs-dp"
            element={<Imp34620Q4ShareRoundoffFloorVsDpViz />}
          />
          <Route
            path="/viz-imp34642-roundoff-amplification-exponent-ladder"
            element={<Imp34642RoundoffAmplificationExponentLadderViz />}
          />
          <Route
            path="/viz-imp34667-four-rung-roundoff-floor-ladder"
            element={<Imp34667FourRungRoundoffFloorLadderViz />}
          />
          <Route
            path="/viz-imp34621-eflow-attr-slope-continuity"
            element={<Imp34621EflowAttrSlopeContinuityViz />}
          />
          <Route
            path="/viz-imp34622-eflow-attr-fp-floor-slope-drift"
            element={<Imp34622EflowAttrFpFloorSlopeDriftViz />}
          />
          <Route
            path="/viz-imp34623-deflow-residual-oneoverlogn"
            element={<Imp34623DeflowResidualOneOverLogNViz />}
          />
          <Route
            path="/viz-imp34637-eflow-attr-log-curvature-check"
            element={<Imp34637EflowAttrLogCurvatureCheckViz />}
          />
          <Route
            path="/viz-imp34639-stencil-tail-spread-crosscheck"
            element={<Imp34639StencilTailSpreadCrosscheckViz />}
          />
          <Route
            path="/viz-imp34641-deflow-identifiability-window"
            element={<Imp34641DeflowIdentifiabilityWindowViz />}
          />
          <Route
            path="/viz-imp34655-local-scaling-order-climb"
            element={<Imp34655LocalScalingOrderClimbViz />}
          />
          <Route
            path="/viz-imp34664-pole-window-bias-variance"
            element={<Imp34664PoleWindowBiasVarianceViz />}
          />
          <Route
            path="/viz-imp34681-punctured-pole-window"
            element={<Imp34681PuncturedPoleWindowViz />}
          />
          <Route
            path="/viz-imp34656-roundoff-prefactor-amplitude"
            element={<Imp34656RoundoffPrefactorAmplitudeViz />}
          />
          <Route
            path="/viz-imp34671-truncation-sweet-spot-plateau"
            element={<Imp34671TruncationSweetSpotPlateauViz />}
          />
          <Route
            path="/viz-imp34674-shared-stencil-plateau-crossvalidation"
            element={<Imp34674SharedStencilPlateauCrossvalidationViz />}
          />
          <Route
            path="/viz-imp34677-banach-contraction-certificate"
            element={<Imp34677BanachContractionCertificateViz />}
          />
          <Route
            path="/viz-imp34680-three-term-share-spread-roundoff-valley"
            element={<Imp34680ThreeTermShareSpreadRoundoffValleyViz />}
          />
          <Route
            path="/viz-imp34696-right-widening-banach-certificate"
            element={<Imp34696RightWideningBanachCertificateViz />}
          />
          <Route
            path="/viz-imp34697-left-edge-contraction-boundary"
            element={<Imp34697LeftEdgeContractionBoundaryViz />}
          />
          <Route
            path="/viz-imp34699-collapse-factor-vs-inverse-dp-k-mismatch"
            element={<Imp34699CollapseFactorVsInverseDpKMismatchViz />}
          />
          <Route
            path="/viz-imp34701-raw-float-weight-plateau-shift-by-stencil-order"
            element={<Imp34701RawFloatWeightPlateauShiftByStencilOrderViz />}
          />
          <Route
            path="/viz-imp34715-crossover-margin-monotone"
            element={<Imp34715CrossoverMarginMonotoneViz />}
          />
          <Route
            path="/viz-imp34716-resolution-matched-collapse-ladder"
            element={<Imp34716ResolutionMatchedCollapseLadderViz />}
          />
          <Route
            path="/viz-imp34717-q3-trust-boundary"
            element={<Imp34717Q3TrustBoundaryViz />}
          />
          <Route
            path="/viz-imp34718-derivative-crosscheck-wide-grid"
            element={<Imp34718DerivativeCrosscheckWideGridViz />}
          />
          <Route
            path="/viz-imp34719-sigma-exponent-ramp-knee"
            element={<Imp34719SigmaExponentRampKneeViz />}
          />
          <Route
            path="/viz-imp34736-sigma-knee-residual-budget"
            element={<Imp34736SigmaKneeResidualBudgetViz />}
          />
          <Route
            path="/viz-imp34737-dp-star-far-tail-ladder"
            element={<Imp34737DpStarFarTailLadderViz />}
          />
          <Route
            path="/viz-imp34747-second-footing-collapse-ladder"
            element={<Imp34747SecondFootingCollapseLadderViz />}
          />
          <Route
            path="/viz-imp34758-dp-star-probe-band-ratio"
            element={<Imp34758DpStarProbeBandRatioViz />}
          />
          <Route
            path="/viz-imp34759-crossover-gpp-ceiling"
            element={<Imp34759CrossoverGppCeilingViz />}
          />
          <Route
            path="/viz-imp34782-dp-star-full-tail-edge-ratio"
            element={<Imp34782DpStarFullTailEdgeRatioViz />}
          />
          <Route
            path="/viz-imp34783-picard-iters-to-floor"
            element={<Imp34783PicardItersToFloorViz />}
          />
          <Route
            path="/viz-imp34784-krawczyk-outward-ulp-slack-N"
            element={<Imp34784KrawczykOutwardUlpSlackNViz />}
          />
          <Route
            path="/viz-imp34761-three-footing-collapse-ladder"
            element={<Imp34761ThreeFootingCollapseLadderViz />}
          />
          <Route
            path="/viz-imp34763-cmb-elasticity-sigma-peak"
            element={<Imp34763CmbElasticitySigmaPeakViz />}
          />
          <Route
            path="/viz-imp34765-sigma-knee-cf-elasticity"
            element={<Imp34765SigmaKneeCfElasticityViz />}
          />
          <Route
            path="/viz-imp34767-far-tail-two-stencil-crossvalidation"
            element={<Imp34767FarTailTwoStencilCrossvalidationViz />}
          />
          <Route
            path="/viz-imp34779-crossover-gpp-curvature-guard"
            element={<Imp34779CrossoverGppCurvatureGuardViz />}
          />
          <Route
            path="/viz-imp34780-sigma-knee-residual-decomposition"
            element={<Imp34780SigmaKneeResidualDecompositionViz />}
          />
          <Route
            path="/viz-imp34781-collapse-ladder-mean-zero-ensemble"
            element={<Imp34781CollapseLadderMeanZeroEnsembleViz />}
          />
          <Route
            path="/viz-imp34807-collapse-ladder-channel-sigma-comparison"
            element={<Imp34807CollapseLadderChannelSigmaComparisonViz />}
          />
          <Route
            path="/viz-imp34808-krawczyk-contraction-gap-headroom"
            element={<Imp34808KrawczykContractionGapHeadroomViz />}
          />
          <Route
            path="/viz-imp34809-sigma-knee-third-order-residual-budget"
            element={<Imp34809SigmaKneeThirdOrderResidualBudgetViz />}
          />
          <Route
            path="/viz-imp34810-crossover-n-stencil-order-band"
            element={<Imp34810CrossoverNStencilOrderBandViz />}
          />
          <Route
            path="/viz-imp34811-krawczyk-delta-sweep-k-star-ladder"
            element={<Imp34811KrawczykDeltaSweepKStarLadderViz />}
          />
          <Route
            path="/viz-imp34825-winding-count-ladder"
            element={<Imp34825WindingCountLadderViz />}
          />
          <Route
            path="/viz-imp34830-directed-rounding-width-bound"
            element={<Imp34830DirectedRoundingWidthBoundViz />}
          />
          <Route
            path="/viz-imp34832-ncross-three-way-landmark-comparison"
            element={<Imp34832NCrossThreeWayLandmarkComparisonViz />}
          />
          <Route
            path="/viz-imp34852-cmb-sweep-sign-flip-ladder"
            element={<Imp34852CmbSweepSignFlipLadderViz />}
          />
          <Route
            path="/viz-imp34853-fifth-order-v-expansion-term-ladder"
            element={<Imp34853FifthOrderVExpansionTermLadderViz />}
          />
          <Route
            path="/viz-imp34854-d2-locator-convergence"
            element={<Imp34854D2LocatorConvergenceViz />}
          />
          <Route
            path="/viz-imp34855-five-band-shrink-ratio-ladder"
            element={<Imp34855FiveBandShrinkRatioLadderViz />}
          />
          <Route
            path="/viz-imp34873-sigma-knee-d3-halving-ladder"
            element={<Imp34873SigmaKneeD3HalvingLadderViz />}
          />
          <Route
            path="/viz-imp34874-cmb-elasticity-curvature-ladder"
            element={<Imp34874CmbElasticityCurvatureLadderViz />}
          />
          <Route
            path="/viz-imp34875-interval-ceil-margin"
            element={<Imp34875IntervalCeilMarginViz />}
          />
          <Route
            path="/viz-imp34876-shrink-ratio-limit"
            element={<Imp34876ShrinkRatioLimitViz />}
          />
          <Route
            path="/viz-imp34877-crossover-derivative-ladder"
            element={<Imp34877CrossoverDerivativeLadderViz />}
          />
          <Route
            path="/viz-imp34890-sixth-deriv-ladder"
            element={<Imp34890SixthDerivLadderViz />}
          />
          <Route
            path="/viz-imp34891-two-rate-off-by-one"
            element={<Imp34891TwoRateOffByOneViz />}
          />
          <Route
            path="/viz-imp34892-cauchy-hadamard-root-test"
            element={<Imp34892CauchyHadamardRootTestViz />}
          />
          <Route
            path="/viz-imp34911-forward-breach-band-uniformity"
            element={<Imp34911ForwardBreachBandUniformityViz />}
          />
          <Route
            path="/viz-imp34912-pade-borel-resummation-inertness"
            element={<Imp34912PadeBorelResummationInertnessViz />}
          />
          <Route
            path="/viz-imp34913-signed-residual-offset-inversion"
            element={<Imp34913SignedResidualOffsetInversionViz />}
          />
          <Route
            path="/viz-imp34914-eflow-knee-inflection-crossing"
            element={<Imp34914EflowKneeInflectionCrossingViz />}
          />
          <Route
            path="/viz-imp34915-krawczyk-worstcase-headroom-band"
            element={<Imp34915KrawczykWorstcaseHeadroomBandViz />}
          />
          <Route
            path="/viz-imp34916-domb-sykes-radius-extrapolation"
            element={<Imp34916DombSykesRadiusExtrapolationViz />}
          />
          <Route
            path="/viz-imp34934-eflow-ramp-position-sweep"
            element={<Imp34934EflowRampPositionSweepViz />}
          />
          <Route
            path="/viz-imp34935-sigma-knee-analytic-vs-fd-derivative"
            element={<Imp34935SigmaKneeAnalyticVsFdDerivativeViz />}
          />
          <Route
            path="/viz-imp34936-sigma-knee-eps-sweep"
            element={<Imp34936SigmaKneeEpsSweepViz />}
          />
          <Route
            path="/viz-imp34937-iter-floor-residual-wide-band"
            element={<Imp34937IterFloorResidualWideBandViz />}
          />
          <Route
            path="/viz-imp34938-landmark-reconciliation-axis"
            element={<Imp34938LandmarkReconciliationAxisViz />}
          />
          <Route
            path="/viz-imp34939-krawczyk-headroom-h2-ceiling-band"
            element={<Imp34939KrawczykHeadroomH2CeilingBandViz />}
          />
          <Route
            path="/viz-imp34940-op-depth-newton-step-reconciliation"
            element={<Imp34940OpDepthNewtonStepReconciliationViz />}
          />
          <Route
            path="/viz-imp34958-inflection-offset-running-vs-fixed-ladder"
            element={<Imp34958InflectionOffsetRunningVsFixedLadderViz />}
          />
          <Route
            path="/viz-imp34959-sign-pattern-neville-divergence"
            element={<Imp34959SignPatternNevilleDivergenceViz />}
          />
          <Route
            path="/viz-imp34960-raw-total-crossing"
            element={<Imp34960RawTotalCrossingViz />}
          />
          <Route
            path="/viz-imp34961-breach-step-doubling"
            element={<Imp34961BreachStepDoublingViz />}
          />
          <Route
            path="/viz-imp34962-krawczyk-headroom-monotonicity-derivative"
            element={<Imp34962KrawczykHeadroomMonotonicityDerivativeViz />}
          />
          <Route
            path="/viz-imp34963-eflow-crossing-strength-power-law"
            element={<Imp34963EflowCrossingStrengthPowerLawViz />}
          />
          <Route
            path="/viz-imp34964-eflow-pinned-product-invariance"
            element={<Imp34964EflowPinnedProductInvarianceViz />}
          />
          <Route
            path="/viz-imp34965-iters-to-floor-ceil-boundary-geometry"
            element={<Imp34965ItersToFloorCeilBoundaryGeometryViz />}
          />
          <Route
            path="/viz-imp34978-double-double-log-ulp-band-wide"
            element={<Imp34978DoubleDoubleLogUlpBandWideViz />}
          />
          <Route
            path="/viz-imp34980-r-margin-dyadic-wall-sweep"
            element={<Imp34980RMarginDyadicWallSweepViz />}
          />
          <Route
            path="/viz-imp34981-landmark-gap-reconstruction-ladder"
            element={<Imp34981LandmarkGapReconstructionLadderViz />}
          />
          <Route
            path="/viz-imp34983-sigma-knee-crossing-cmb-sensitivity"
            element={<Imp34983SigmaKneeCrossingCmbSensitivityViz />}
          />
          <Route
            path="/viz-imp34985-pinned-product-window-sensitivity"
            element={<Imp34985PinnedProductWindowSensitivityViz />}
          />
          <Route
            path="/viz-imp34986-crossover-numerator-polynomial-ladder"
            element={<Imp34986CrossoverNumeratorPolynomialLadderViz />}
          />
          <Route
            path="/viz-imp34998-conjugate-pair-singularity-angle-cross-check"
            element={<Imp34998ConjugatePairSingularityAngleCrossCheckViz />}
          />
          <Route
            path="/viz-imp34999-krawczyk-margin-infimum-band-endpoint"
            element={<Imp34999KrawczykMarginInfimumBandEndpointViz />}
          />
          <Route
            path="/viz-imp35000-eflow-crossing-strength-exponent-decomposition"
            element={<Imp35000EflowCrossingStrengthExponentDecompositionViz />}
          />
          <Route
            path="/viz-imp35001-plus-one-impossibility-margin-band"
            element={<Imp35001PlusOneImpossibilityMarginBandViz />}
          />
          <Route
            path="/viz-imp35018-four-landmark-cluster-log-n"
            element={<Imp35018FourLandmarkClusterLogNViz />}
          />
          <Route
            path="/viz-imp35030-far-tail-inflection-offset-ladder"
            element={<Imp35030FarTailInflectionOffsetLadderViz />}
          />
          <Route
            path="/viz-imp35022-pinned-product-decomposition"
            element={<Imp35022PinnedProductDecompositionViz />}
          />
          <Route
            path="/viz-imp35026-sigma-decay-landmark-ladder"
            element={<Imp35026SigmaDecayLandmarkLadderViz />}
          />
          <Route
            path="/viz-imp35077-conjugate-pair-darboux-trajectory"
            element={<Imp35077ConjugatePairDarbouxTrajectoryViz />}
          />
          <Route
            path="/viz-imp35079-combined-inflection-offset-ladder"
            element={<Imp35079CombinedInflectionOffsetLadderViz />}
          />
          <Route
            path="/viz-imp35080-loglog-crossing-strength-power-law"
            element={<Imp35080LogLogCrossingStrengthPowerLawViz />}
          />
          <Route
            path="/viz-imp35081-surplus-conversion-residual-waterfall"
            element={<Imp35081SurplusConversionResidualWaterfallViz />}
          />
          <Route
            path="/viz-imp35118-bernstein-signature-ladder"
            element={<Imp35118BernsteinSignatureLadderViz />}
          />
          <Route
            path="/viz-imp35123-bootstrap-exponent-distribution"
            element={<Imp35123BootstrapExponentDistributionViz />}
          />
          <Route
            path="/viz-imp35138-sigma-deep-tail-threshold-ladder"
            element={<Imp35138SigmaDeepTailThresholdLadderViz />}
          />
          <Route
            path="/viz-imp35139-eflow-qeff-profile"
            element={<Imp35139EflowQeffProfileViz />}
          />
          <Route
            path="/viz-imp35140-running-g-ramp-vs-sigmoid-split"
            element={<Imp35140RunningGRampVsSigmoidSplitViz />}
          />
          <Route
            path="/viz-imp35206-horizon-front-mismatch"
            element={<Imp35206HorizonFrontMismatchViz />}
          />
          <Route
            path="/viz-imp35207-two-window-incompatibility"
            element={<Imp35207TwoWindowIncompatibilityViz />}
          />
          <Route
            path="/viz-imp35208-deg-ladder"
            element={<Imp35208DegLadderViz />}
          />
          <Route
            path="/viz-imp35209-margin-ratio-ladder"
            element={<Imp35209MarginRatioLadderViz />}
          />
          <Route
            path="/viz-imp35210-four-e-component-landmarks"
            element={<Imp35210FourEComponentLandmarksViz />}
          />
          <Route
            path="/viz-imp35231-eflow-fartail-exponent-logn-correction"
            element={<Imp35231EflowFartailExponentLogNCorrectionViz />}
          />
          <Route
            path="/viz-imp35232-schedule-corridor-collapse"
            element={<Imp35232ScheduleCorridorCollapseViz />}
          />
          <Route
            path="/viz-imp35233-beta-front-law-n-uniformity"
            element={<Imp35233BetaFrontLawNUniformityViz />}
          />
          <Route
            path="/viz-imp35234-rho-deviation-loglog-modulus"
            element={<Imp35234RhoDeviationLogLogModulusViz />}
          />
          <Route
            path="/viz-imp35252-real-vs-unit-background-field-sup-contrast"
            element={<Imp35252RealVsUnitBackgroundFieldSupContrastViz />}
          />
          <Route
            path="/viz-imp35272-prefactor-ladder"
            element={<Imp35272PrefactorLadderViz />}
          />
          <Route
            path="/viz-imp35273-rho-remainder-structure"
            element={<Imp35273RhoRemainderStructureViz />}
          />
          <Route
            path="/viz-imp35274-ecoll-exponent-residual-ladder"
            element={<Imp35274EcollExponentResidualLadderViz />}
          />
          <Route
            path="/viz-imp35275-krawczyk-headroom-band-profile"
            element={<Imp35275KrawczykHeadroomBandProfileViz />}
          />
          <Route
            path="/viz-imp35288-r2-flow-ladder-slack"
            element={<Imp35288R2FlowLadderSlackViz />}
          />
          <Route
            path="/viz-imp35293-three-factor-invariant-real-ordinates"
            element={<Imp35293ThreeFactorInvariantRealOrdinatesViz />}
          />
          <Route
            path="/viz-imp35294-eflow-fartail-residual-monotone"
            element={<Imp35294EflowFartailResidualMonotoneViz />}
          />
          <Route
            path="/viz-imp35295-eflow-fartail-residual-decomposition"
            element={<Imp35295EflowFartailResidualDecompositionViz />}
          />
          <Route
            path="/viz-imp35296-min-gap-strip-advantage"
            element={<Imp35296MinGapStripAdvantageViz />}
          />
          <Route
            path="/viz-imp35308-reentry-band"
            element={<Imp35308ReentryBandViz />}
          />
          <Route
            path="/viz-imp35254-eflow-fartail-two-term-law"
            element={<Imp35254EflowFartailTwoTermLawViz />}
          />
          <Route
            path="/viz-imp35183-sigma-fartail-exponent-ladder"
            element={<Imp35183SigmaFartailExponentLadderViz />}
          />
          <Route
            path="/viz-imp35184-bernstein-ingredients-triple"
            element={<Imp35184BernsteinIngredientsTripleViz />}
          />
          <Route
            path="/viz-imp35314-fidelity-certificate-diagram"
            element={<Imp35314FidelityCertificateDiagramViz />}
          />
          <Route
            path="/viz-imp35320-sign-ladder-roundoff-ceiling"
            element={<Imp35320SignLadderRoundoffCeilingViz />}
          />
          <Route
            path="/viz-imp35329-exponent-drift-closing-comparison"
            element={<Imp35329ExponentDriftClosingComparisonViz />}
          />
          <Route
            path="/viz-imp35344-floor-sensitivity-curve"
            element={<Imp35344FloorSensitivityCurveViz />}
          />
          <Route
            path="/viz-imp35345-extrapolation-gap"
            element={<Imp35345ExtrapolationGapViz />}
          />
          <Route
            path="/viz-imp35346-expansion-slot-ladder"
            element={<Imp35346ExpansionSlotLadderViz />}
          />
          <Route
            path="/viz-imp35347-fixed-point-contraction"
            element={<Imp35347FixedPointContractionViz />}
          />
          <Route
            path="/viz-imp35362-n2000-collision-envelope"
            element={<Imp35362N2000CollisionEnvelopeViz />}
          />
          <Route
            path="/viz-imp35381-eflow-fartail-swap-fraction"
            element={<Imp35381EflowFartailSwapFractionViz />}
          />
          <Route
            path="/viz-imp35400-eflow-fartail-two-component-ladder"
            element={<Imp35400EflowFartailTwoComponentLadderViz />}
          />
          <Route
            path="/viz-imp35404-krawczyk-headroom-cancellation"
            element={<Imp35404KrawczykHeadroomCancellationViz />}
          />
          <Route
            path="/viz-imp35837-krawczyk-cancellation-ratio"
            element={<Imp35837KrawczykCancellationRatioViz />}
          />
          <Route
            path="/viz-imp35460-reentry-band-landmark-disposal"
            element={<Imp35460ReentryBandLandmarkDisposalViz />}
          />
          <Route
            path="/viz-imp35482-sigma-peak-plateau-width-sqrt-scaling"
            element={<Imp35482SigmaPeakPlateauWidthSqrtScalingViz />}
          />
          <Route
            path="/viz-imp35483-eflow-fartail-remnant-sub1e3-crossing"
            element={<Imp35483EflowFartailRemnantSub1e3CrossingViz />}
          />
          <Route
            path="/viz-imp35506-endpoint-positivity-map"
            element={<Imp35506EndpointPositivityMapViz />}
          />
          <Route
            path="/viz-imp35541-scheme-independence"
            element={<Imp35541SchemeIndependenceViz />}
          />
          <Route
            path="/viz-imp35544-sigma-three-input-decomposition"
            element={<Imp35544SigmaThreeInputDecompositionViz />}
          />
          <Route
            path="/viz-imp35549-height-map-divergence"
            element={<Imp35549HeightMapDivergenceViz />}
          />
          <Route
            path="/viz-imp35561-peak-height-map-sensitivity"
            element={<Imp35561PeakHeightMapSensitivityViz />}
          />
          <Route
            path="/viz-imp35564-fartail-product-decay"
            element={<Imp35564FartailProductDecayViz />}
          />
          <Route
            path="/viz-imp35580-req4-height-gap"
            element={<Imp35580Req4HeightGapViz />}
          />
          <Route
            path="/viz-imp35582-reentry-band-data-unreachability"
            element={<Imp35582ReentryBandDataUnreachabilityViz />}
          />
          <Route
            path="/viz-imp35587-arm-asymmetry"
            element={<Imp35587ArmAsymmetryViz />}
          />
          <Route
            path="/viz-imp35593-peak-damping"
            element={<Imp35593PeakDampingViz />}
          />
          <Route
            path="/viz-imp35597-threshold-collapse"
            element={<Imp35597ThresholdCollapseViz />}
          />
          <Route
            path="/viz-imp35628-req-severity-ranking"
            element={<Imp35628ReqSeverityRankingViz />}
          />
          <Route
            path="/viz-imp35663-decade-span-growth"
            element={<Imp35663DecadeSpanGrowthViz />}
          />
          <Route
            path="/viz-imp35664-fartail-crossing-height-map-sensitivity"
            element={<Imp35664FartailCrossingHeightMapSensitivityViz />}
          />
          <Route
            path="/viz-imp35665-pinsker-common-functional-bridge"
            element={<Imp35665PinskerBridgeViz />}
          />
          <Route
            path="/viz-imp35710-winding-mesh-cost-delta-ladder"
            element={<Imp35710WindingMeshCostDeltaLadderViz />}
          />
          <Route
            path="/viz-imp35750-beat-parity-handoff-sigma"
            element={<Imp35750BeatParityHandoffSigmaViz />}
          />
          <Route
            path="/viz-imp35751-postport-shares-sigma"
            element={<Imp35751PostportSharesSigmaViz />}
          />
          <Route
            path="/viz-imp35772-collision-scale-prefactor-propagation"
            element={<Imp35772CollisionScalePrefactorPropagationViz />}
          />
          <Route
            path="/viz-imp35975-beat-parity-nsigma-ladder"
            element={<Imp35975BeatParityNsigmaLadderViz />}
          />
          <Route
            path="/viz-imp35823-required-height-ladder"
            element={<Imp35823RequiredHeightLadderViz />}
          />
          <Route
            path="/viz-imp35824-surplus-waterfall"
            element={<Imp35824SurplusWaterfallViz />}
          />
          <Route
            path="/viz-imp35863-krawczyk-split-inversion"
            element={<Imp35863KrawczykSplitInversionViz />}
          />
          <Route
            path="/viz-imp35864-debruijn-digit-ladder"
            element={<Imp35864DebruijnDigitLadderViz />}
          />
          <Route
            path="/viz-imp35865-summation-scheme-ladder"
            element={<Imp35865SummationSchemeLadderViz />}
          />
          <Route
            path="/viz-imp35934-kappa-sweep-ladder"
            element={<Imp35934KappaSweepLadderViz />}
          />
          <Route
            path="/viz-imp35935-adversarial-ordering"
            element={<Imp35935AdversarialOrderingViz />}
          />
          <Route
            path="/viz-imp35936-req4-height-multiple-sigma"
            element={<Imp35936ReqHeightMultipleSigmaViz />}
          />
          <Route
            path="/viz-imp35957-rdirect-floor-height-sweep"
            element={<Imp35957RdirectFloorHeightSweepViz />}
          />
          <Route
            path="/viz-imp35386-kemp-bracketing-ladder"
            element={<Imp35386KempBracketingLadderViz />}
          />
          <Route
            path="/viz-imp35771-req4-height-multiple"
            element={<Imp35771Req4HeightMultipleViz />}
          />
          <Route
            path="/viz-imp36025-e-share-stacked-bar"
            element={<Imp36025EShareStackedBarViz />}
          />
          <Route
            path="/viz-imp36143-e-share-threshold-crossing-ladder"
            element={<Imp36143EShareThresholdCrossingLadderViz />}
          />
          <Route
            path="/viz-imp36203-e-share-five-landmark-decay-curve"
            element={<Imp36203EShareFiveLandmarkDecayCurveViz />}
          />
          <Route
            path="/viz-imp36204-kbn-kahan-two-episode-separation"
            element={<Imp36204KbnKahanTwoEpisodeSeparationViz />}
          />
          <Route
            path="/viz-imp36211-route-readiness-comparison"
            element={<Imp36211RouteReadinessComparisonViz />}
          />
          <Route
            path="/viz-imp36226-clustered-vs-default-depth-scaling"
            element={<Imp36226ClusteredVsDefaultDepthScalingViz />}
          />
          <Route
            path="/viz-imp36227-en-threefold-imp321-ladder"
            element={<Imp36227EnThreefoldImp321LadderViz />}
          />
          <Route
            path="/viz-imp36173-b2-tstar-checklist-ladder"
            element={<Imp36173B2TstarChecklistLadderViz />}
          />
          <Route
            path="/viz-imp36192-i2-truncation-blowup"
            element={<Imp36192I2TruncationBlowupViz />}
          />
          <Route
            path="/viz-imp36251-krawczyk-residual-operator-fixedpoint"
            element={<Imp36251KrawczykResidualOperatorFixedpointViz />}
          />
          <Route
            path="/viz-imp36267-crossover-sensitivity"
            element={<Imp36267CrossoverSensitivityViz />}
          />
          <Route
            path="/viz-imp36268-panel-count-ratio"
            element={<Imp36268PanelCountRatioViz />}
          />
          <Route
            path="/viz-imp36287-kbn-floor-headroom-divergence"
            element={<Imp36287KbnFloorHeadroomDivergenceViz />}
          />
          <Route
            path="/viz-imp36288-routeb-slope-convergence"
            element={<Imp36288RouteBSlopeConvergenceViz />}
          />
          <Route
            path="/viz-imp95240-o5-site-coverage-margins"
            element={<Imp95240O5SiteCoverageMarginsViz />}
          />
          <Route
            path="/viz-imp95141-ythaw-obligation-meter"
            element={<Imp95141YthawObligationMeterViz />}
          />
          <Route
            path="/viz-imp95265-evoct-firing-curve"
            element={<Imp95265EvOctFiringCurveViz />}
          />
          <Route
            path="/viz-imp95266-theta-vs-k-phase-collapse"
            element={<Imp95266ThetaVsKPhaseCollapseViz />}
          />
          <Route
            path="/viz-imp95273-theta-vacuity-distribution"
            element={<Imp95273ThetaVacuityDistributionViz />}
          />
          <Route
            path="/viz-imp95267-offlattice-robustness"
            element={<Imp95267OffLatticeRobustnessViz />}
          />
          <Route
            path="/viz-imp95268-collar-overprice"
            element={<Imp95268CollarOverpriceViz />}
          />
          <Route
            path="/viz-imp96039-halfgram-interlacing-census"
            element={<Imp96039HalfGramInterlacingCensusViz />}
          />
          <Route
            path="/viz-imp95143-vacuity-saturation-corridor"
            element={<Imp95143VacuitySaturationCorridorViz />}
          />
          <Route
            path="/viz-imp95125-attainment-shortfall-decay"
            element={<Imp95125AttainmentShortfallDecayViz />}
          />
          <Route
            path="/viz-imp95144-tier-certifier-ballop-budget-gap"
            element={<Imp95144TierCertifierBallOpBudgetGapViz />}
          />
          <Route
            path="/viz-imp95242-tier-certifier-baseline-vs-design-gap"
            element={<Imp95242TierCertifierBaselineVsDesignGapViz />}
          />
          <Route
            path="/viz-imp95278-window1-coverage-bar"
            element={<Imp95278Window1CoverageBarViz />}
          />
          <Route
            path="/viz-imp95279-phasecert-vs-nogo-ceiling"
            element={<Imp95279PhaseCertVsNogoCeilingViz />}
          />
          <Route
            path="/viz-imp95282-coallaw-vs-lambda2"
            element={<Imp95282CoalLawVsLambda2Viz />}
          />
          <Route
            path="/viz-imp95303-conflb-vs-coaln-window-pinch"
            element={<Imp95303ConfLbVsCoalNWindowPinchViz />}
          />
          <Route
            path="/viz-imp95304-phaseam-vs-phasecert-ceilx"
            element={<Imp95304PhaseAmVsPhaseCertCeilXViz />}
          />
          <Route
            path="/viz-imp95305-splitrz-vs-evoctunif-onset"
            element={<Imp95305SplitRzVsEvOctUnifOnsetViz />}
          />
          <Route
            path="/viz-imp95317-confluent-bracket-across-r"
            element={<Imp95317ConfluentBracketAcrossRViz />}
          />
          <Route
            path="/viz-imp95319-splitrz-vs-splitloo-collar"
            element={<Imp95319SplitRzVsSplitLooCollarViz />}
          />
          <Route
            path="/viz-imp95349-rzpen-gain-ladder"
            element={<Imp95349RzPenGainLadderViz />}
          />
          <Route
            path="/viz-imp95350-chart-tail-cap-vs-uniform-c3n"
            element={<Imp95350ChartTailCapVsUniformC3nViz />}
          />
          <Route
            path="/viz-imp95351-unif6-vs-unif5-across-rho"
            element={<Imp95351Unif6VsUnif5AcrossRhoViz />}
          />
          <Route
            path="/viz-imp95546-rzpen78-gain-ladder"
            element={<Imp95546RzPen78GainLadderViz />}
          />
          <Route
            path="/viz-imp95547-alpha-kh-heat-scatter"
            element={<Imp95547AlphaKhHeatScatterViz />}
          />
          <Route
            path="/viz-imp95434-theta-range-descent-overlap-growth"
            element={<Imp95434ThetaRangeDescentOverlapGrowthViz />}
          />
          <Route
            path="/viz-imp95607-gumbelz-band"
            element={<Imp95607GumbelZBandViz />}
          />
          <Route
            path="/viz-imp95435-rzpen-offlattice-degradation-ladder"
            element={<Imp95435RzpenOfflatticeDegradationLadderViz />}
          />
          <Route
            path="/viz-imp95491-combined-offlattice-onset-ladder"
            element={<Imp95491CombinedOfflatticeOnsetLadderViz />}
          />
          <Route
            path="/viz-imp95492-breach-threshold-surface"
            element={<Imp95492BreachThresholdSurfaceViz />}
          />
          <Route
            path="/viz-imp95493-rstar-two-end-accuracy"
            element={<Imp95493RstarTwoEndAccuracyViz />}
          />
          <Route
            path="/viz-imp95622-sigma-exponent-ramp"
            element={<Imp95622SigmaExponentRampViz />}
          />
          <Route
            path="/viz-imp95623-seam-gram-onset-ladder"
            element={<Imp95623SeamGramOnsetLadderViz />}
          />
          <Route
            path="/viz-imp95548-per-prime-sbar-budget"
            element={<Imp95548PerPrimeSbarBudgetViz />}
          />
          <Route
            path="/viz-imp95624-mty-vs-vk-crossover"
            element={<Imp95624MtyVsVkCrossoverViz />}
          />
          <Route
            path="/viz-imp95645-kronecker-transfer-constant"
            element={<Imp95645KroneckerTransferConstantViz />}
          />
          <Route
            path="/viz-imp95646-transition-knee-2d-heatmap"
            element={<Imp95646TransitionKnee2DHeatmapViz />}
          />
          <Route
            path="/viz-imp95670-physical-band-vs-wedge"
            element={<Imp95670PhysicalBandVsWedgeViz />}
          />
          <Route
            path="/viz-imp95647-condition-number"
            element={<Imp95647ConditionNumberViz />}
          />
          <Route
            path="/viz-imp95731-number-variance-ratio"
            element={<Imp95731NumberVarianceRatioViz />}
          />
          <Route
            path="/viz-imp95828-bracket-cluster"
            element={<Imp95828BracketClusterViz />}
          />
          <Route
            path="/viz-imp95752-finite80-bias-heatmap"
            element={<Imp95752Finite80BiasHeatmapViz />}
          />
          <Route
            path="/viz-imp95753-crossover-height-window"
            element={<Imp95753CrossoverHeightWindowViz />}
          />
          <Route
            path="/viz-imp95754-cf-wedge-depth-vs-multiplier"
            element={<Imp95754CfWedgeDepthVsMultiplierViz />}
          />
          <Route
            path="/viz-imp95759-msq-pointwise-wall"
            element={<Imp95759MsqPointwiseWallViz />}
          />
          <Route
            path="/viz-imp95790-rcap-deadzone"
            element={<Imp95790RCapDeadZoneViz />}
          />
          <Route
            path="/viz-imp95791-biaspct-vs-rho"
            element={<Imp95791BiasPctVsRhoViz />}
          />
          <Route
            path="/viz-imp95808-bias-union-heatmap"
            element={<Imp95808TwinPairBiasUnionHeatmapViz />}
          />
          <Route
            path="/viz-imp95809-deep-corner-bias-ladder"
            element={<Imp95809DeepCornerBiasConvergenceLadderViz />}
          />
          <Route
            path="/viz-imp95810-reach-universality"
            element={<Imp95810ReachUniversalityViz />}
          />
          <Route
            path="/viz-imp95792-di-zigzag"
            element={<Imp95792DiZigzagViz />}
          />
          <Route
            path="/viz-imp95777-di-share-amplification"
            element={<Imp95777DiShareAmplificationViz />}
          />
          <Route
            path="/viz-imp95868-biasn2-widom-fit"
            element={<Imp95868BiasN2WidomFitViz />}
          />
          <Route
            path="/viz-imp95869-two-sided-envelope"
            element={<Imp95869TwoSidedEnvelopeViz />}
          />
          <Route
            path="/viz-imp95688-vk-crossover-height-gap"
            element={<Imp95688VkCrossoverHeightGapViz />}
          />
          <Route
            path="/viz-imp95668-deficit-fartail-limit"
            element={<Imp95668DeficitFartailLimitViz />}
          />
          <Route
            path="/viz-imp95681-eflow-inversion-contour-surface"
            element={<Imp95681EflowInversionContourSurfaceViz />}
          />
          <Route
            path="/viz-imp95699-cf-band-reachability"
            element={<Imp95699CfBandReachabilityViz />}
          />
          <Route
            path="/viz-imp95682-twin-pair-block-floor-rho"
            element={<Imp95682TwinPairBlockFloorRhoViz />}
          />
          <Route
            path="/viz-imp95697-szego-finite-size-decay"
            element={<Imp95697SzegoFiniteSizeDecayViz />}
          />
          <Route
            path="/viz-imp95549-ns-rigid-pencil-eigenvalue"
            element={<Imp95549NsRigidPencilEigenvalueViz />}
          />
          <Route
            path="/viz-imp95565-alpha-over-one-majorant-mass-fraction"
            element={<Imp95565AlphaOverOneMajorantMassFractionViz />}
          />
          <Route
            path="/viz-imp95566-alias-energy-in-algebra"
            element={<Imp95566AliasEnergyInAlgebraViz />}
          />
          <Route
            path="/viz-imp95567-doubly-exponential-height-ceiling"
            element={<Imp95567DoublyExponentialHeightCeilingViz />}
          />
          <Route
            path="/viz-imp95770-barrier-mollifier-length-ceiling"
            element={<Imp95770BarrierMollifierLengthCeilingViz />}
          />
          <Route
            path="/viz-imp95771-q0-signal-vs-const-sector"
            element={<Imp95771Q0SignalVsConstSectorViz />}
          />
          <Route
            path="/viz-imp95776-cf-reff-gue-repulsion"
            element={<Imp95776CfReffGueViz />}
          />
          <Route
            path="/viz-imp95366-rzpen-onset-drop-ladder"
            element={<Imp95366RzPenOnsetDropLadderViz />}
          />
          <Route
            path="/viz-imp96075-route-m-vasyunin-dn-ladder"
            element={<Imp96075RouteMVasyuninDnLadderViz />}
          />
          <Route
            path="/viz-imp96080-route-i-symbol-anatomy"
            element={<Imp96080RouteISymbolAnatomyViz />}
          />
          <Route
            path="/viz-imp96576-route-i-window-anatomy"
            element={<Imp96576RouteICertifiedMinimizerWindowAnatomyViz />}
          />
          <Route
            path="/viz-imp96577-route-i-certificate-constant-ladder"
            element={<Imp96577RouteICertificateConstantLadderViz />}
          />
          <Route
            path="/viz-imp96581-route-m-lammax-rigorous-vs-measured"
            element={<Imp96581RouteILammaxRigorousVsMeasuredViz />}
          />
          <Route
            path="/viz-imp96663-route-m-condfit-ladder"
            element={<Imp96663RouteMCondfitLadderViz />}
          />
          <Route
            path="/viz-imp96670-route-m-lammax-majorants"
            element={<Imp96670RouteMLammaxMajorantsViz />}
          />
          <Route
            path="/viz-imp96683-route-m-conditioning-ceiling-ci"
            element={<Imp96683RouteMConditioningCeilingCiViz />}
          />
          <Route
            path="/viz-imp96701-frobenius-majorant-eleven-rung"
            element={<Imp96701FrobeniusMajorantElevenRungViz />}
          />
          <Route
            path="/viz-imp96702-route-m-reach-projection"
            element={<Imp96702RouteMReachProjectionViz />}
          />
          <Route
            path="/viz-imp96777-krein-lammin-n-trend"
            element={<Imp96777KreinLammminNTrendViz />}
          />
          <Route
            path="/viz-imp96779-route-m-ceiling-ladder"
            element={<Imp96779RouteMCeilingLadderViz />}
          />
          <Route
            path="/viz-imp96801-gmin-exponent-noise-band"
            element={<Imp96801GminExponentNoiseBandViz />}
          />
          <Route
            path="/viz-imp96723-route-m-three-ceiling-decomposition"
            element={<Imp96723RouteMThreeCeilingDecompositionViz />}
          />
          <Route
            path="/viz-imp96640-route-m-rankr-power-iteration-bracket"
            element={<Imp96640RankrPowerIterationBracketViz />}
          />
          <Route
            path="/viz-imp96641-gmin-gue-envelope"
            element={<Imp96641GminGueEnvelopeViz />}
          />
          <Route
            path="/viz-imp96679-gmin-ratio-sawtooth"
            element={<Imp96679GminRatioSawtoothViz />}
          />
          <Route
            path="/viz-imp96646-krein-certificate-margin"
            element={<Imp96646KreinCertificateMarginViz />}
          />
          <Route
            path="/viz-imp96661-krein-ft-curve"
            element={<Imp96661KreinFtCurveViz />}
          />
          <Route
            path="/viz-imp96662-lammax-rankr-slope-onset"
            element={<Imp96662LammaxRankrSlopeOnsetViz />}
          />
          <Route
            path="/viz-imp96721-sigma2-emp-vs-gue"
            element={<Imp96721Sigma2EmpVsGueViz />}
          />
          <Route
            path="/viz-imp96600-basis-c-floor-ladder"
            element={<Imp96600BasisCFloorLadderViz />}
          />
          <Route
            path="/viz-imp96739-basis-c-above-anchor-ladder-lstar-crossover"
            element={<Imp96739BasisCAboveAnchorLadderLstarCrossoverViz />}
          />
          <Route
            path="/viz-imp96822-gmin-ladder-reach-frontier"
            element={<Imp96822GminLadderReachFrontierViz />}
          />
          <Route
            path="/viz-imp96925-krein-t-truncation-deficit"
            element={<Imp96925KreinTTruncationDeficitViz />}
          />
          <Route
            path="/viz-imp97367-krein-csharp-coupled-nt-grid"
            element={<Imp97367KreinCsharpCoupledNTGridViz />}
          />
          <Route
            path="/viz-imp97390-krein-csharp-upperbrackets-sidebyside"
            element={<Imp97390KreinCsharpUpperBracketsSideBySideViz />}
          />
          <Route
            path="/viz-imp97418-krein-csharp-floor-ladder"
            element={<Imp97418KreinCsharpFloorLadderViz />}
          />
          <Route
            path="/viz-imp97452-rk-floor-linear-ladder"
            element={<Imp97452RkFloorLinearLadderViz />}
          />
          <Route
            path="/viz-imp97467-crossover-fraction-tolerance-ladder"
            element={<Imp97467CrossoverFractionToleranceLadderViz />}
          />
          <Route
            path="/viz-imp97485-krein-realizability-gap"
            element={<Imp97485KreinRealizabilityGapViz />}
          />
          <Route
            path="/viz-imp97486-sigma2-second-moment-profile"
            element={<Imp97486Sigma2SecondMomentProfileViz />}
          />
          <Route
            path="/viz-imp97551-w1lower-farfield-margin"
            element={<Imp97551W1LowerFarFieldMarginViz />}
          />
          <Route
            path="/viz-imp97552-e1-envelope-decay"
            element={<Imp97552E1EnvelopeDecayViz />}
          />
          <Route
            path="/viz-imp97553-kappa-decomposition"
            element={<Imp97553KappaDecompositionViz />}
          />
          <Route
            path="/viz-imp97554-b4-ceiling-minb-p0"
            element={<Imp97554B4CeilingMinBP0Viz />}
          />
          <Route
            path="/viz-imp97487-bimodal-1pct-crossover"
            element={<Imp97487Bimodal1PctCrossoverViz />}
          />
          <Route
            path="/viz-imp97488-krein-route2-kbig-saturation"
            element={<Imp97488KreinRoute2KbigSaturationViz />}
          />
          <Route
            path="/viz-imp97504-krein-route2-kbig-direct-floor"
            element={<Imp97504KreinRoute2KbigDirectFloorViz />}
          />
          <Route
            path="/viz-imp97550-krein-route2-lambda-floor-trace"
            element={<Imp97550KreinRoute2LambdaFloorTraceViz />}
          />
          <Route
            path="/viz-imp97505-krein-well-capture-tradeoff"
            element={<Imp97505KreinWellCaptureTradeoffViz />}
          />
          <Route
            path="/viz-imp97506-window-set-surrogate-depth"
            element={<Imp97506WindowSetSurrogateDepthViz />}
          />
          <Route
            path="/viz-imp97549-two-term-law-descent-surrogate"
            element={<Imp97549TwoTermLawDescentSurrogateViz />}
          />
          <Route
            path="/viz-imp97507-krein-nscaled-tgrid-heatmap"
            element={<Imp97507KreinNscaledTgridHeatmapViz />}
          />
          <Route
            path="/viz-imp97508-mcm-baseterm-extprec"
            element={<Imp97508McmBasetermExtprecViz />}
          />
          <Route
            path="/viz-imp97526-named-concentration-tool-verdict-table"
            element={<Imp97526NamedConcentrationToolVerdictTableViz />}
          />
          <Route
            path="/viz-imp97569-confined-well-sign-map"
            element={<Imp97569ConfinedWellSignMapViz />}
          />
          <Route
            path="/viz-imp97528-krein-tail-converged-drift"
            element={<Imp97528KreinTailConvergedDriftViz />}
          />
          <Route
            path="/viz-imp97471-mcm-tower-per-level-margin"
            element={<Imp97471McmTowerPerLevelMarginViz />}
          />
          <Route
            path="/viz-imp97426-per-term-overcharge-ladder"
            element={<Imp97426PerTermOverchargeLadderViz />}
          />
          <Route
            path="/viz-imp97427-sigma-fartail-exponent-ladder"
            element={<Imp97427SigmaFartailExponentLadderViz />}
          />
          <Route
            path="/viz-imp97368-w1-sign-profile"
            element={<Imp97368W1SignProfileViz />}
          />
          <Route
            path="/viz-imp97369-krein-routeb-enclosure"
            element={<Imp97369RouteBEnclosureViz />}
          />
          <Route
            path="/viz-imp96741-route-m-three-ceiling-decomposition"
            element={<Imp96741RouteMThreeCeilingDecompositionViz />}
          />
          <Route
            path="/viz-imp96742-safe-direction-sign-per-rung"
            element={<Imp96742SafeDirectionSignPerRungViz />}
          />
          <Route
            path="/viz-imp96604-lammax-normalized-ratio"
            element={<Imp96604LammaxNormalizedRatioViz />}
          />
          <Route
            path="/viz-imp96621-sigma2-lammin-margin-ladder"
            element={<Imp96621Sigma2LamminMarginLadderViz />}
          />
          <Route
            path="/viz-imp96606-cert-limit-crossover"
            element={<Imp96606CertLimitCrossoverViz />}
          />
          <Route
            path="/viz-imp96598-sine-kernel-lag-decay"
            element={<Imp96598SineKernelLagDecayViz />}
          />
          <Route
            path="/viz-imp96103-route-i-remainder-resonance"
            element={<Imp96103RouteIRemainderResonanceViz />}
          />
          <Route
            path="/viz-imp95371-bcap-two-branch-cap-vs-exact-ratio"
            element={<Imp95371BcapTwoBranchCapVsExactRatioViz />}
          />
          <Route
            path="/viz-imp95390-ri-margin-heatmap"
            element={<Imp95390RiMarginHeatmapViz />}
          />
          <Route
            path="/viz-imp95391-split2-splitloo-crossover"
            element={<Imp95391Split2SplitLooCrossoverViz />}
          />
          <Route
            path="/viz-imp95392-precision-replay-cost-ladder"
            element={<Imp95392PrecisionReplayCostLadderViz />}
          />
          <Route
            path="/viz-imp95409-rhostar-depthflip"
            element={<Imp95409RhoStarDepthFlipViz />}
          />
          <Route
            path="/viz-imp95477-karatsuba-crossover-ladder"
            element={<Imp95477KaratsubaCrossoverLadderViz />}
          />
          <Route
            path="/viz-imp95393-ymin-maps-theta-obstructed"
            element={<Imp95393YminMapsThetaObstructedViz />}
          />
          <Route
            path="/viz-imp95413-evoct-onset-sensitivity"
            element={<Imp95413EvOctOnsetSensitivityViz />}
          />
          <Route
            path="/viz-imp95469-binding-chart-migration"
            element={<Imp95469BindingChartMigrationViz />}
          />
          <Route
            path="/viz-imp95449-ppos-enclosure-tightness"
            element={<Imp95449PposEnclosureTightnessViz />}
          />
          <Route
            path="/viz-imp95448-ra-ladder-input-provenance"
            element={<Imp95478RaLadderInputProvenanceViz />}
          />
          <Route
            path="/viz-imp95587-legb-straddle-vs-ratio"
            element={<Imp95587LegBStraddleVsRatioViz />}
          />
          <Route
            path="/viz-imp95588-msq-gue-envelope"
            element={<Imp95588MsqGueEnvelopeViz />}
          />
          <Route
            path="/viz-imp95589-w-decay-curves"
            element={<Imp95589WDecayCurvesViz />}
          />
          <Route
            path="/viz-imp95737-half-retention-scale"
            element={<Imp95737HalfRetentionScaleViz />}
          />
          <Route
            path="/viz-imp95886-decade-reach-ledger"
            element={<Imp95886DecadeReachLedgerViz />}
          />
          <Route
            path="/viz-imp95997-ufit-ledger"
            element={<Imp95997UfitLedgerViz />}
          />
          <Route
            path="/viz-imp95887-szego-dd-toeplitz-chain"
            element={<Imp95887SzegoDdToeplitzChainViz />}
          />
          <Route
            path="/viz-imp95888-rcap-window-bottom"
            element={<Imp95888RcapWindowBottomViz />}
          />
          <Route
            path="/viz-imp95971-crossing-height-map"
            element={<Imp95971CrossingHeightMapViz />}
          />
          <Route
            path="/viz-imp95914-ufit-comparison-panel"
            element={<Imp95914UfitComparisonViz />}
          />
          <Route
            path="/viz-imp95930-c0-offset-envelope"
            element={<Imp95930C0OffsetEnvelopeViz />}
          />
          <Route
            path="/viz-imp96040-a0-reconcile-panel"
            element={<Imp96040A0ReconcilePanelViz />}
          />
          <Route
            path="/viz-imp96136-route-i-fixed-fraction-panel"
            element={<Imp96136RouteIFixedFractionPanelViz />}
          />
          <Route
            path="/viz-imp96239-ushape-slope-drift"
            element={<Imp96239UshapeSlopeDriftViz />}
          />
          <Route
            path="/viz-imp95931-ln12-descent-ladder"
            element={<Imp95931Ln12DescentLadderViz />}
          />
          <Route
            path="/viz-imp95975-tier13-imbalance-loglog"
            element={<Imp95975TierImbalanceLogLogViz />}
          />
          <Route
            path="/viz-imp95993-worst-alias-margin"
            element={<Imp95993WorstAliasMarginViz />}
          />
          <Route
            path="/viz-imp95995-vars-constant-decomposition"
            element={<Imp95995VarsConstantDecompositionViz />}
          />
          <Route path="/rh-novel-routes-roadmap" element={<RhNovelRoutesRoadmapPage />} />
          <Route path="/routes-roadmap" element={<ResearchRoutesRoadmapPage />} />
          <Route
            path="/viz-imp96015-fracbelownull-saturation"
            element={<Imp96015FracBelowNullSaturationViz />}
          />
          <Route
            path="/viz-imp96016-vars-constant-stack"
            element={<Imp96016VarSConstantDecompositionViz />}
          />
          <Route
            path="/viz-imp96115-below-envelope-dip-significance-table"
            element={<Imp96115BelowEnvelopeDipSignificanceTableViz />}
          />
          <Route
            path="/viz-imp96139-window-robustness-sweep-table"
            element={<Imp96139WindowRobustnessSweepTableViz />}
          />
          <Route
            path="/viz-imp96212-two-branch-etrunc-obstruction"
            element={<Imp96212TwoBranchEtruncObstructionViz />}
          />
          <Route
            path="/viz-imp96141-excursion-depth-offset-ledger-table"
            element={<Imp96141ExcursionDepthOffsetLedgerTableViz />}
          />
          <Route
            path="/viz-imp96216-route-bd-margin-column-gamma1000-table"
            element={<Imp96216RouteBDMarginColumnGamma1000TableViz />}
          />
          <Route
            path="/viz-imp96199-route-bd-margin-column-gamma500-table"
            element={<Imp96199RouteBDMarginColumnGamma500TableViz />}
          />
          <Route
            path="/viz-imp96038-route-a-lammin-descent"
            element={<Imp96038RouteALammMinDescentViz />}
          />
          <Route
            path="/viz-imp96120-route-m-burnol-ratio-dense-ladder"
            element={<Imp96120RouteMBurnolRatioDenseLadderViz />}
          />
          <Route
            path="/viz-imp96214-kato-temple-ueps"
            element={<Imp96214KatoTempleUepsViz />}
          />
          <Route
            path="/viz-imp96215-ushape-peak-accident"
            element={<Imp96215UshapePeakAccidentViz />}
          />
          <Route
            path="/viz-imp96142-decorrelation-safety-margin"
            element={<Imp96142DecorrelationSafetyMarginViz />}
          />
          <Route
            path="/viz-imp96236-route-bd-margin-gamma2000"
            element={<Imp96236RouteBDMarginGamma2000ChartViz />}
          />
          <Route
            path="/viz-imp96263-route-bd-margin-gamma4000"
            element={<Imp96263RouteBDMarginGamma4000ChartViz />}
          />
          <Route
            path="/viz-imp96237-height-to-floor-law"
            element={<Imp96237HeightToFloorViz />}
          />
          <Route
            path="/viz-imp96238-joint-leak-region"
            element={<Imp96238JointLeakRegionViz />}
          />
          <Route
            path="/viz-imp96256-joint-anchor-sweep"
            element={<Imp96256JointAnchorSweepViz />}
          />
          <Route
            path="/viz-imp96160-max-anchor-window-robustness"
            element={<Imp96160MaxAnchorWindowRobustnessViz />}
          />
          <Route
            path="/viz-imp96176-sigma-closed-form-ladder"
            element={<Imp96176SigmaClosedFormLadderViz />}
          />
          <Route
            path="/viz-imp96197-en-decay-exponent-ladder"
            element={<Imp96197EnDecayExponentLadderViz />}
          />
          <Route
            path="/viz-imp96257-ushape-slope-drift"
            element={<Imp96257UshapeSlopeDriftViz />}
          />
          <Route
            path="/viz-imp96294-eflow-residual"
            element={<Imp96294EflowResidualViz />}
          />
          <Route
            path="/viz-imp96422-eflow-frac-ladder-peak-recovery"
            element={<Imp96422EflowFracLadderPeakRecoveryViz />}
          />
          <Route
            path="/viz-imp96393-discrepancy-envelope"
            element={<Imp96393DiscrepancyEnvelopeViz />}
          />
          <Route
            path="/viz-imp96377-off-anchor-residual"
            element={<Imp96377OffAnchorResidualViz />}
          />
          <Route
            path="/viz-imp96298-pref-at-rayleigh"
            element={<Imp96298PrefAtRayleighViz />}
          />
          <Route
            path="/viz-imp96299-margin-floor-loo"
            element={<Imp96299MarginFloorLooViz />}
          />
          <Route
            path="/viz-imp96314-covariance-deviation"
            element={<Imp96314CovarianceDeviationViz />}
          />
          <Route
            path="/viz-imp96316-etrunc-sensitivity"
            element={<Imp96316EtruncSensitivityViz />}
          />
          <Route
            path="/viz-imp96318-confident-span-crossing"
            element={<Imp96318ConfidentSpanCrossingViz />}
          />
          <Route
            path="/viz-imp96262-model-selection-scores"
            element={<Imp96262ModelSelectionScoresViz />}
          />
          <Route
            path="/viz-imp96320-route-l-reach-band"
            element={<Imp96320RouteLReachBandViz />}
          />
          <Route
            path="/viz-imp96302-route-l-reach-power-law"
            element={<Imp96302RouteLReachPowerLawViz />}
          />
          <Route
            path="/viz-imp96322-e-decomposition"
            element={<Imp96322EDecompositionViz />}
          />
          <Route
            path="/viz-imp96334-ecoll-rate-ch-independence"
            element={<Imp96334EcollRateChIndependenceChartViz />}
          />
          <Route
            path="/viz-imp96337-mixed-ladder-margin"
            element={<Imp96337MixedLadderMarginViz />}
          />
          <Route
            path="/viz-imp96378-route-m-beat-period-overlap"
            element={<Imp96378RouteMBeatPeriodOverlapViz />}
          />
          <Route
            path="/viz-imp96399-route-m-reach-reprice"
            element={<Imp96399RouteMReachRepriceViz />}
          />
          <Route
            path="/viz-imp96338-worst-excess-evt"
            element={<Imp96338WorstExcessEvtViz />}
          />
          <Route
            path="/viz-imp96410-sigma-peak-knee-crossover"
            element={<Imp96410SigmaPeakKneeCrossoverViz />}
          />
          <Route
            path="/viz-imp96475-etrunc-sensitivity"
            element={<Imp96475EtruncSensitivityViz />}
          />
          <Route
            path="/viz-imp96494-sigma-knee-widened-grid"
            element={<Imp96494SigmaKneeWidenedGridViz />}
          />
          <Route
            path="/viz-imp96497-excursion-significance-sensitivity"
            element={<Imp96497ExcursionSignificanceSensitivityViz />}
          />
          <Route
            path="/viz-imp96478-count-gap-share"
            element={<Imp96478CountGapShareViz />}
          />
          <Route
            path="/viz-imp96560-basis-c-crossover-band-narrowing"
            element={<Imp96560BasisCCrossoverBandNarrowingViz />}
          />
          <Route
            path="/viz-imp96395-sigma-local-exponent-ramp"
            element={<Imp96395SigmaLocalExponentRampViz />}
          />
          <Route
            path="/viz-imp96401-intercept-se-trajectory"
            element={<Imp96401InterceptSeTrajectoryViz />}
          />
          <Route
            path="/viz-imp96413-count-model-sensitivity-ladder"
            element={<Imp96413CountModelSensitivityLadderViz />}
          />
          <Route
            path="/viz-imp96438-route-m-full-ladder"
            element={<Imp96438RouteMFullLadderViz />}
          />
          <Route
            path="/viz-imp96439-three-basis-rho-crossvalidation"
            element={<Imp96439ThreeBasisRhoCrossvalidationViz />}
          />
          <Route
            path="/viz-imp96453-basis-c-corroboration-crossover"
            element={<Imp96453BasisCCorroborationCrossoverViz />}
          />
          <Route
            path="/viz-imp96454-ecoll-gap-ladder"
            element={<Imp96454EcollGapLadderViz />}
          />
          <Route
            path="/viz-imp96455-ckh-sensitivity"
            element={<Imp96455CKhSensitivityViz />}
          />
          <Route
            path="/viz-imp96456-vasyunin-conditioning-ceiling"
            element={<Imp96456VasyuninConditioningCeilingViz />}
          />
          <Route
            path="/viz-imp96514-excursion-2sigma-interior-scan"
            element={<Imp96514Excursion2SigmaInteriorScanViz />}
          />
          <Route
            path="/viz-imp96515-ppp-collapse-map"
            element={<Imp96515PppCollapseViz />}
          />
          <Route
            path="/viz-imp96516-route-m-remainder-model"
            element={<Imp96516RouteMRemainderViz />}
          />
          <Route
            path="/viz-imp96498-solver-spread-count-shift-crossover"
            element={<Imp96498SolverSpreadCountShiftCrossoverViz />}
          />
          <Route
            path="/viz-imp96520-offset-drift-ldrift-prediction"
            element={<Imp96520OffsetDriftLdriftPredictionViz />}
          />
          <Route
            path="/viz-imp96534-ar-effective-count-ladder"
            element={<Imp96534ArEffectiveCountLadderViz />}
          />
          <Route
            path="/viz-imp124840-fartail-per-nine-ladder"
            element={<Imp124840FartailPerNineLadderViz />}
          />
          <Route
            path="/viz-imp124824-ecf-stencil-crossover"
            element={<Imp124824EcfStencilCrossoverViz />}
          />
          <Route
            path="/viz-imp124882-dps-invariance-ladder"
            element={<Imp124882DpsInvarianceLadderViz />}
          />
          <Route
            path="/viz-imp124841-knee-locator-comparison"
            element={<Imp124841KneeLocatorComparisonViz />}
          />
          <Route
            path="/viz-imp124842-roundoff-law"
            element={<Imp124842RoundoffLawViz />}
          />
          <Route
            path="/viz-imp124843-kernel-ratio-consumer"
            element={<Imp124843KernelRatioConsumerViz />}
          />
          <Route
            path="/viz-imp124918-kernel-ratio-bracket"
            element={<Imp124918KernelRatioBracketViz />}
          />
          <Route
            path="/viz-imp96535-ledger-reconciliation"
            element={<Imp96535LedgerReconciliationViz />}
          />
          <Route
            path="/viz-imp96554-two-exponent-relerr-cone"
            element={<Imp96554TwoExponentRelErrConeViz />}
          />
          <Route
            path="/viz-imp96555-route-i-concentration-ladder"
            element={<Imp96555RouteIConcentrationLadderViz />}
          />
          <Route
            path="/viz-imp96557-eflow-domination-kappa"
            element={<Imp96557EflowDominationKappaViz />}
          />
          <Route
            path="/viz-imp96671-spectral-share-vs-measured-slope"
            element={<Imp96671SpectralShareVsMeasuredSlopeViz />}
          />
          <Route
            path="/viz-imp97040-orphaned-calibration-leaves"
            element={<Imp97040OrphanedCalibrationLeavesTabbedViz />}
          />
          <Route
            path="/viz-imp97041-nyquist-alias-periodogram"
            element={<Imp97041NyquistAliasPeriodogramViz />}
          />
          <Route
            path="/viz-imp97082-ritz-vs-rigorous-crossval-range"
            element={<Imp97082RitzVsRigorousCrossvalRangeViz />}
          />
          <Route
            path="/viz-imp97068-mirror-descent-poisson-kernel"
            element={<Imp97068MirrorDescentPoissonKernelViz />}
          />
          <Route
            path="/viz-imp97652-tail-model-fraction-band"
            element={<Imp97652TailModelFractionBandViz />}
          />
          <Route
            path="/viz-imp97653-tail-bias-floor"
            element={<Imp97653TailBiasFloorViz />}
          />
          <Route
            path="/viz-imp97654-additivity-residual-eps-squared-collapse"
            element={<Imp97654AdditivityResidualEpsSquaredCollapseViz />}
          />
          <Route
            path="/viz-imp97670-three-axis-elasticity"
            element={<Imp97670ThreeAxisElasticityViz />}
          />
          <Route
            path="/viz-imp97812-tra2-ratio-ladder"
            element={<Imp97812TrA2RatioLadderViz />}
          />
          <Route
            path="/viz-imp124815-pairratio-ladder"
            element={<Imp124815PairRatioLadderViz />}
          />
          <Route
            path="/viz-imp124899-kernel-arm-offset-asymmetry"
            element={<Imp124899KernelArmOffsetAsymmetryViz />}
          />
          <Route
            path="/viz-imp97671-gap-law-decay-exponent"
            element={<Imp97671GapLawDecayExponentViz />}
          />
          <Route
            path="/viz-imp97715-route-m-exponent-robustness"
            element={<Imp97715RouteMExponentRobustnessViz />}
          />
          <Route
            path="/viz-imp97716-wrapper-elasticity-5point"
            element={<Imp97716WrapperElasticity5PointViz />}
          />
          <Route
            path="/viz-imp97745-fartail-diagnostic-asymptote"
            element={<Imp97745FarTailDiagnosticAsymptoteViz />}
          />
          <Route
            path="/viz-imp97765-fartail-crossing-heights"
            element={<Imp97765FarTailCrossingHeightsViz />}
          />
          <Route
            path="/viz-imp97806-full-sigma-diagnostic-curve"
            element={<Imp97806FullSigmaDiagnosticCurveViz />}
          />
          <Route
            path="/viz-imp97787-fartail-hump-min-crossover"
            element={<Imp97787FarTailDiagnosticHumpMinCrossoverViz />}
          />
          <Route
            path="/viz-imp97748-fold-amplitude-landmark-decomposition"
            element={<Imp97748FoldAmplitudeLandmarkDecompositionViz />}
          />
          <Route
            path="/viz-imp97729-fartail-residual-twopiece-crossover"
            element={<Imp97729FarTailResidualTwoPieceCrossoverViz />}
          />
          <Route
            path="/viz-imp97730-diag3-stencil-refine"
            element={<Imp97730Diag3StencilRefineViz />}
          />
          <Route
            path="/viz-imp124845-diag3-additivity-flowshare"
            element={<Imp124845Diag3AdditivityFlowshareViz />}
          />
          <Route
            path="/viz-imp124880-pairratio-drift-slope-scatter"
            element={<Imp124880PairratioDriftSlopeScatterViz />}
          />
          <Route
            path="/viz-imp124881-floor-elasticity-sidebyside"
            element={<Imp124881FloorElasticitySidebysideViz />}
          />
          <Route
            path="/viz-imp124961-f2-residual-curvature-u"
            element={<Imp124961F2ResidualCurvatureUViz />}
          />
          <Route
            path="/viz-imp124963-sigma-diagnostic-cluster-analysis"
            element={<Imp124963SigmaDiagnosticClusterAnalysisPage />}
          />
          <Route
            path="/viz-imp97732-wlin-residual-halfdependence"
            element={<Imp97732WlinResidualHalfDependenceViz />}
          />
          <Route
            path="/viz-imp97746-mcm-dps-cap-scaling"
            element={<Imp97746McmDpsCapScalingViz />}
          />
          <Route
            path="/viz-imp97747-route-m-deep-ladder"
            element={<Imp97747RouteMDeepLadderViz />}
          />
          <Route
            path="/viz-imp97106-palm-mirror-surplus-comparison"
            element={<Imp97106PalmMirrorSurplusComparisonViz />}
          />
          <Route
            path="/viz-imp97111-route-m-reach-confidence-ladder"
            element={<Imp97111RouteMReachConfidenceLadderViz />}
          />
          <Route
            path="/viz-imp97212-route-m-residual-sign-magnitude"
            element={<Imp97212RouteMResidualSignMagnitudeViz />}
          />
          <Route
            path="/viz-imp97389-route-m-sign-law-omega-ladder"
            element={<Imp97389RouteMSignLawOmegaLadderViz />}
          />
          <Route
            path="/viz-imp97453-route-m-sign-magnitude-omega-ladder"
            element={<Imp97453RouteMSignLawMagnitudeLadderViz />}
          />
          <Route
            path="/viz-imp97470-route-m-sign-law-omega5-binet-decay"
            element={<Imp97470RouteMSignLawOmega5BinetDecayViz />}
          />
          <Route
            path="/viz-imp97409-b4-ceiling-sign-condition-omega-classes"
            element={<Imp97409B4CeilingSignConditionOmegaClassesViz />}
          />
          <Route
            path="/viz-imp97213-route-m-explicit-remainder-envelope"
            element={<Imp97213RouteMExplicitRemainderEnvelopeViz />}
          />
          <Route
            path="/viz-imp97214-route-m-farfield-slopeband-vs-original"
            element={<Imp97214RouteMFarfieldSlopebandVsOriginalViz />}
          />
          <Route
            path="/viz-imp97215-route-m-kappa-decomposition"
            element={<Imp97215RouteMKappaDecompositionViz />}
          />
          <Route
            path="/viz-imp97216-route-m-per-class-saturation-ratio"
            element={<Imp97216RouteMPerClassSaturationRatioViz />}
          />
          <Route
            path="/viz-imp97217-krein-csharp-nt-coupled-descent"
            element={<Imp97217KreinCsharpNTCoupledDescentViz />}
          />
          <Route
            path="/viz-imp97300-palm-mirror-frac-ladder"
            element={<Imp97300PalmMirrorFracLadderViz />}
          />
          <Route
            path="/viz-imp97301-e1-quarter-b-saturation"
            element={<Imp97301E1QuarterBSaturationViz />}
          />
          <Route
            path="/viz-imp97302-inverse-line-diag-offdiag-coleading"
            element={<Imp97302InverseLineDiagOffdiagCoLeadingViz />}
          />
          <Route
            path="/viz-imp97303-bessel-hankel-majorant"
            element={<Imp97303BesselHankelMajorantViz />}
          />
          <Route
            path="/viz-imp97316-committed-cjk-sparsity-band"
            element={<Imp97316CommittedCjkSparsityBandViz />}
          />
          <Route
            path="/viz-imp97388-second-moment-decomposition"
            element={<Imp97388SecondMomentDecompositionViz />}
          />
          <Route
            path="/viz-imp97413-sigma-ladder-subdecade-knee"
            element={<Imp97413SigmaLadderSubdecadeKneeViz />}
          />
          <Route
            path="/viz-imp97570-crossover-crest-combined"
            element={<Imp97570CrossoverCrestCombinedViz />}
          />
          <Route
            path="/viz-imp97572-csharp-floor-ladder"
            element={<Imp97572CsharpFloorLadderViz />}
          />
          <Route
            path="/viz-imp97587-krein-farprofile-envelope"
            element={<Imp97587KreinFarprofileEnvelopeViz />}
          />
          <Route
            path="/viz-imp97588-mcm-baseterm-K0-approach"
            element={<Imp97588McmBaseTermK0ApproachViz />}
          />
          <Route
            path="/viz-imp97589-sigma-landmark-ladder"
            element={<Imp97589SigmaLandmarkLadderViz />}
          />
          <Route
            path="/viz-imp97612-cusp-separation"
            element={<Imp97612CuspSeparationViz />}
          />
          <Route
            path="/viz-imp97613-eflow-share-decay"
            element={<Imp97613EflowShareDecayViz />}
          />
          <Route
            path="/viz-imp97614-tailbias-Rsweep"
            element={<Imp97614TailBiasRSweepViz />}
          />
          <Route
            path="/viz-imp97627-mcm-margin-collapse-ladder"
            element={<Imp97627McmMarginCollapseLadderViz />}
          />
          <Route
            path="/viz-imp97628-mcm-surrogate-vs-fullh-onset"
            element={<Imp97628McmSurrogateVsFullhOnsetViz />}
          />
          <Route
            path="/viz-imp97629-realizable-fraction-window-climb"
            element={<Imp97629RealizableFractionWindowClimbViz />}
          />
          <Route
            path="/viz-imp97630-lambda2-floor-spread-waterfall"
            element={<Imp97630Lambda2FloorSpreadWaterfallViz />}
          />
          <Route
            path="/viz-imp97631-sigma-landmark-elasticity-comparison"
            element={<Imp97631SigmaLandmarkElasticityComparisonViz />}
          />
          <Route
            path="/viz-imp97635-omega10-extremality-margin"
            element={<Imp97635Omega10ExtremalityMarginViz />}
          />
          <Route
            path="/viz-imp97651-tra2-ratio-drift"
            element={<Imp97651Tra2RatioDriftViz />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </Suspense>
        </RouteErrorBoundary>
      </main>
      <footer style={{
        padding: '24px 16px',
        color: '#475569',
        fontSize: 13,
        borderTop: '1px solid #1e293b',
        marginTop: 48,
        fontFamily: 'var(--font-mono)',
      }}>
        <div style={{ textAlign: 'center' }}>
          Found a bug? Copy the error card text and{' '}
          <a
            href="https://github.com/judegomila/zeta-explorer/issues"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#475569', textDecoration: 'underline' }}
          >
            paste it in a new issue
          </a>
          {' '}&mdash; &copy; Jude Gomila 2026-onwards
        </div>
      </footer>
    </>
  );
}

export default function App() {
  return (
    <MathModalProvider>
    <HashRouter>
      <AppShell />
    </HashRouter>
    </MathModalProvider>
  );
}

