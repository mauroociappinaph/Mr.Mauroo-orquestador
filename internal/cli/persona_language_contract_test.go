package cli

import (
	"testing"

	"github.com/mr-mauroo/mr-mauroo-ai/internal/model"
)

func TestNormalizePersonaAcceptsMrMaurooNeutralArtifacts(t *testing.T) {
	got, err := normalizePersona("mr-mauroo-neutral-artifacts")
	if err != nil {
		t.Fatalf("normalizePersona() error = %v", err)
	}
	if got != model.PersonaMrMaurooNeutralArtifacts {
		t.Fatalf("normalizePersona() = %q, want %q", got, model.PersonaMrMaurooNeutralArtifacts)
	}
}
