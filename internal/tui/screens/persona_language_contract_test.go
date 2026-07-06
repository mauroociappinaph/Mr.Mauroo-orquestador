package screens

import (
	"strings"
	"testing"

	"github.com/mr-mauroo/mr-mauroo-ai/internal/model"
)

func TestPersonaOptionsIncludeMrMaurooNeutralArtifacts(t *testing.T) {
	options := PersonaOptions()
	found := false
	for _, option := range options {
		if option == model.PersonaMrMaurooNeutralArtifacts {
			found = true
		}
	}
	if !found {
		t.Fatalf("PersonaOptions() = %v, missing %q", options, model.PersonaMrMaurooNeutralArtifacts)
	}
}

func TestRenderPersonaDescribesMrMaurooNeutralArtifacts(t *testing.T) {
	out := RenderPersona(model.PersonaMrMaurooNeutralArtifacts, 2)
	for _, want := range []string{
		"mr-mauroo-neutral-artifacts",
		"Mr.Mauroo conversation",
		"English technical artifacts",
		"context language",
	} {
		if !strings.Contains(out, want) {
			t.Fatalf("RenderPersona() missing %q; output:\n%s", want, out)
		}
	}
}
