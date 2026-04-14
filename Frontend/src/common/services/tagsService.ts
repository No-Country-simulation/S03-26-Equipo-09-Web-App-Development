/**
 * Tags Service - Gestión de etiquetas personalizables en Leads
 */

export interface Tag {
  id: string;
  nombre: string;
  color: string;
  icono?: string;
}

export interface LeadTag {
  leadId: string;
  tagId: string;
}

class TagsService {
  private tags: Tag[] = [];
  private leadTags: Map<string, string[]> = new Map();

  constructor() {
    this.loadTags();
    this.loadLeadTags();
  }

  /**
   * Crear nueva etiqueta
   */
  createTag(nombre: string, color: string, icono?: string): Tag {
    const tag: Tag = {
      id: `tag-${Date.now()}`,
      nombre,
      color,
      icono
    };
    this.tags.push(tag);
    this.saveTags();
    return tag;
  }

  /**
   * Obtener todas las etiquetas
   */
  getTags(): Tag[] {
    return this.tags;
  }

  /**
   * Asignar etiqueta a un lead
   */
  addTagToLead(leadId: string, tagId: string): void {
    if (!this.leadTags.has(leadId)) {
      this.leadTags.set(leadId, []);
    }
    const tags = this.leadTags.get(leadId)!;
    if (!tags.includes(tagId)) {
      tags.push(tagId);
    }
    this.saveLeadTags();
  }

  /**
   * Remover etiqueta de un lead
   */
  removeTagFromLead(leadId: string, tagId: string): void {
    const tags = this.leadTags.get(leadId);
    if (tags) {
      const index = tags.indexOf(tagId);
      if (index > -1) {
        tags.splice(index, 1);
      }
    }
    this.saveLeadTags();
  }

  /**
   * Obtener etiquetas de un lead
   */
  getLeadTags(leadId: string): Tag[] {
    const tagIds = this.leadTags.get(leadId) || [];
    return this.tags.filter(tag => tagIds.includes(tag.id));
  }

  /**
   * Filtrar leads por etiqueta
   */
  filterLeadsByTag(leads: any[], tagId: string): any[] {
    const leadIds = Array.from(this.leadTags.entries())
      .filter(([_, tagIds]) => tagIds.includes(tagId))
      .map(([leadId]) => leadId);
    return leads.filter(lead => leadIds.includes(lead.id));
  }

  /**
   * Eliminar etiqueta (y remover de todos los leads)
   */
  deleteTag(tagId: string): void {
    this.tags = this.tags.filter(tag => tag.id !== tagId);
    this.leadTags.forEach((tagIds) => {
      const index = tagIds.indexOf(tagId);
      if (index > -1) {
        tagIds.splice(index, 1);
      }
    });
    this.saveTags();
    this.saveLeadTags();
  }

  private saveTags(): void {
    localStorage.setItem('crm-tags', JSON.stringify(this.tags));
  }

  private loadTags(): void {
    const stored = localStorage.getItem('crm-tags');
    if (stored) {
      this.tags = JSON.parse(stored) as Tag[];
    } else {
      // Etiquetas por defecto
      this.tags = [
        { id: 'tag-1', nombre: 'Urgente', color: '#ef4444', icono: '🔥' },
        { id: 'tag-2', nombre: 'Seguimiento', color: '#f59e0b', icono: '📌' },
        { id: 'tag-3', nombre: 'Cerrado', color: '#10b981', icono: '✓' }
      ];
      this.saveTags();
    }
  }

  private saveLeadTags(): void {
    const data = Object.fromEntries(this.leadTags);
    localStorage.setItem('crm-lead-tags', JSON.stringify(data));
  }

  private loadLeadTags(): void {
    const stored = localStorage.getItem('crm-lead-tags');
    if (stored) {
      const data = JSON.parse(stored) as Record<string, string[]>;
      this.leadTags = new Map(Object.entries(data));
    }
  }
}

export const tagsService = new TagsService();
