import { Component, inject, computed, signal } from '@angular/core';
import { AnalysisService } from '../analysis.service';
import { FormsModule } from '@angular/forms';

interface InvestorSuggestion {
  displayName: string;
  slug: string;
  description?: string;
}

@Component({
  selector: 'app-analysis',
  imports: [FormsModule],
  templateUrl: './analysis.component.html',
  styleUrl: './analysis.component.css',
})
export class AnalysisComponent {
  readonly analysisService = inject(AnalysisService);

  investorSearchInput = signal('');
  showSuggestions = signal(false);

  // Popular investors with their WhaleWisdom slugs
  readonly investorSuggestions: InvestorSuggestion[] = [
    {
      displayName: 'Berkshire Hathaway Inc',
      slug: 'berkshire-hathaway-inc',
      description: "Warren Buffett's investment company",
    },
    {
      displayName: 'BlackRock Inc',
      slug: 'blackrock-inc',
      description: "World's largest asset manager",
    },
    {
      displayName: 'Vanguard Group Inc',
      slug: 'vanguard-group-inc',
      description: 'Leading investment management company',
    },
    {
      displayName: 'State Street Corp',
      slug: 'state-street-corp',
      description: 'Global financial services company',
    },
    {
      displayName: 'Fidelity Management & Research Co',
      slug: 'fidelity-management-research-co',
      description: 'Large mutual fund company',
    },
    {
      displayName: 'JPMorgan Chase & Co',
      slug: 'jpmorgan-chase-co',
      description: 'Major investment bank',
    },
    {
      displayName: 'Capital Research & Management Co',
      slug: 'capital-research-management-co',
      description: 'Investment management firm',
    },
    {
      displayName: 'Bank of America Corp',
      slug: 'bank-of-america-corp',
      description: 'Major U.S. bank',
    },
    {
      displayName: 'Goldman Sachs Group Inc',
      slug: 'goldman-sachs-group-inc',
      description: 'Investment banking giant',
    },
    {
      displayName: 'Morgan Stanley',
      slug: 'morgan-stanley',
      description: 'Global investment bank',
    },
    {
      displayName: 'T. Rowe Price Group Inc',
      slug: 't-rowe-price-group-inc',
      description: 'Asset management company',
    },
    {
      displayName: 'Wells Fargo & Co',
      slug: 'wells-fargo-co',
      description: 'Major U.S. bank',
    },
    {
      displayName: 'Northern Trust Corp',
      slug: 'northern-trust-corp',
      description: 'Financial services company',
    },
    {
      displayName: 'Charles Schwab Trust Corp',
      slug: 'charles-schwab-trust-co',
      description: 'Brokerage and banking company',
    },
    {
      displayName: 'Invesco Ltd',
      slug: 'invesco-ltd',
      description: 'Global investment management company',
    },
    {
      displayName: 'Franklin Resources Inc',
      slug: 'franklin-resources-inc',
      description: 'Global investment manager',
    },
    {
      displayName: 'American Express Co',
      slug: 'american-express-co',
      description: 'Financial services corporation',
    },
    {
      displayName: 'Pershing Square Capital Management',
      slug: 'pershing-square-capital-management-lp',
      description: "Bill Ackman's hedge fund",
    },
    {
      displayName: 'Icahn Capital LP',
      slug: 'icahn-capital-lp',
      description: "Carl Icahn's investment firm",
    },
    // new
    {
      displayName: 'TIAA-CREF',
      slug: 'tiaa-cref',
      description: 'Institutional investment manager',
    },
    {
      displayName: 'Geode Capital Management',
      slug: 'geode-capital-management',
      description: 'Global investment management firm',
    },
    {
      displayName: 'AllianceBernstein L.P.',
      slug: 'alliancebernstein-lp',
      description: 'Global asset management firm',
    },
    {
      displayName: 'Voya Investment Management',
      slug: 'voya-investment-management',
      description: 'Investment management subsidiary of Voya Financial',
    },
    {
      displayName: 'Northern Trust Asset Management',
      slug: 'northern-trust-asset-management',
      description: 'Subsidiary managing assets for institutional investors',
    },
    {
      displayName: 'Wellington Management Company',
      slug: 'wellington-management-company',
      description: 'Private, independent investment management firm',
    },
    {
      displayName: 'MFS Investment Management K.K.',
      slug: 'mfs-investment-management-k-k',
      description:
        'Global investment management firm offering active strategies',
    },
    {
      displayName: 'MFS Investment Management Canada LTD',
      slug: 'mclean-budden-ltd',
      description:
        'Global investment management firm offering active strategies',
    },
    {
      displayName: 'Janus Henderson Investors',
      slug: 'henderson-group-plc',
      description: 'Global asset management company',
    },
    {
      displayName: 'Baupost Group LLC',
      slug: 'baupost-group-llc-ma',
      description: 'Value-oriented hedge fund led by Seth Klarman',
    },
    {
      displayName: 'Citadel Advisors LLC',
      slug: 'citadel-advisors-llc',
      description: 'Global financial institution and hedge fund',
    },
    {
      displayName: 'D.E. Shaw & Co.',
      slug: 'd-e-shaw-co-inc',
      description: 'Global investment and technology development firm',
    },
    {
      displayName: 'Vanguard Group, Inc.',
      slug: 'vanguard-group-inc',
      description: 'Leading provider of mutual funds and ETFs',
    },
    {
      displayName: 'Charles Schwab Investment Management',
      slug: 'schwab-charles-investment-management-inc',
      description: 'Asset management arm of Charles Schwab',
    },
    {
      displayName: 'Northern Trust Corporation',
      slug: 'northern-trust-corporation',
      description: 'Global financial services holding company',
    },
    {
      displayName: 'Blackstone Group Inc',
      slug: 'blackstone-group-l-p',
      description: 'Global investment business',
    },
    {
      displayName: 'Blackstone Group Management L.L.C',
      slug: 'blackstone-group-management-l-l-c',
      description: 'Global investment business',
    },
    {
      displayName: 'Oaktree Capital Management',
      slug: 'oaktree-capital-management-llc',
      description: 'Global alternative investment management firm',
    },
    {
      displayName: 'Bridgewater Associates',
      slug: 'bridgewater-associates-inc',
      description: 'World’s largest hedge fund by assets under management',
    },
    {
      displayName: 'Third Point LLC',
      slug: 'third-point-llc',
      description: 'Event-driven hedge fund led by Daniel Loeb',
    },
    {
      displayName: 'Pershing Square Capital Management',
      slug: 'pershing-square-capital-management-l-p',
      description: 'Activist investment firm led by Bill Ackman',
    },
    {
      displayName: 'Pershing Square, L.P.',
      slug: 'pershing-square-l-p',
      description: 'Activist investment firm led by Bill Ackman',
    },
    {
      displayName: 'Fundsmith LLP',
      slug: 'fundsmith-llp',
      description: 'UK-based investment management company',
    },
  ];

  // Filter suggestions based on user input
  filteredSuggestions = computed(() => {
    const input = this.investorSearchInput().toLowerCase().trim();
    if (input.length < 2) return [];

    return this.investorSuggestions
      .filter(
        (suggestion) =>
          suggestion.displayName.toLowerCase().includes(input) ||
          suggestion.slug.toLowerCase().includes(input) ||
          (suggestion.description &&
            suggestion.description.toLowerCase().includes(input))
      )
      .slice(0, 8); // Limit to 8 suggestions
  });

  onSearchInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target?.value || '';
    this.investorSearchInput.set(value);
    this.showSuggestions.set(value.trim().length >= 2);
  }

  onSuggestionClick(suggestion: InvestorSuggestion): void {
    this.investorSearchInput.set(suggestion.displayName);
    this.showSuggestions.set(false);
    this.analysisService.searchInvestor(suggestion.slug);
  }

  onSearchInvestor(): void {
    const input = this.investorSearchInput().trim();
    if (input) {
      // Check if the input matches a display name, if so use the slug
      const matchingSuggestion = this.investorSuggestions.find(
        (s) => s.displayName.toLowerCase() === input.toLowerCase()
      );

      const searchValue = matchingSuggestion ? matchingSuggestion.slug : input;
      this.analysisService.searchInvestor(searchValue);
      this.showSuggestions.set(false);
    }
  }

  onInputFocus(): void {
    if (this.investorSearchInput().trim().length >= 2) {
      this.showSuggestions.set(true);
    }
  }

  onInputBlur(): void {
    // Delay hiding suggestions to allow clicks
    setTimeout(() => this.showSuggestions.set(false), 200);
  }

  getWhaleWisdomUrl(investor: string): string {
    // Generate the direct WhaleWisdom URL for the investor
    return `https://whalewisdom.com/filer/${investor}`;
  }

  getCurrentSearchedInvestor(): string {
    return this.analysisService.investorInput();
  }
}
