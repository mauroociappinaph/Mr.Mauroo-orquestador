package cli

import "github.com/mr-mauroo/mr-mauroo-ai/internal/model"

func isMrMaurooConversationPersona(persona model.PersonaID) bool {
	return persona == model.PersonaMrMauroo || persona == model.PersonaMrMaurooNeutralArtifacts
}
