package cli

import (
	"strings"
	"testing"

	"github.com/mr-mauroo/mr-mauroo-ai/internal/model"
	"github.com/mr-mauroo/mr-mauroo-ai/internal/planner"
)

func TestRenderDryRunIncludesPlatformDecision(t *testing.T) {
	result := InstallResult{
		Selection: model.Selection{Persona: model.PersonaMrMauroo, Preset: model.PresetFullMrMauroo},
		Resolved: planner.ResolvedPlan{
			Agents:            []model.AgentID{model.AgentClaudeCode},
			OrderedComponents: []model.ComponentID{model.ComponentEngram},
		},
		Review: planner.ReviewPayload{
			PlatformDecision: planner.PlatformDecision{
				OS:             "linux",
				LinuxDistro:    "ubuntu",
				PackageManager: "apt",
				Supported:      true,
			},
		},
	}

	output := RenderDryRun(result)

	want := "Platform decision: os=linux distro=ubuntu package-manager=apt status=supported"
	if !strings.Contains(output, want) {
		t.Fatalf("RenderDryRun() missing platform decision\noutput=%s", output)
	}
}
